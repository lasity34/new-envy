import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('your-publishable-key-here');

const CheckoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  background: #fff;
  width: 85%;
  margin: auto;
  font-family: "Crimson Text", serif;
`;

const CheckoutTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 300;
  margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  font-size: 1.2rem;
  width: 100%;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #333;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  margin-top: 20px;
`;

const PaymentOptions = styled.div`
  display: flex;
  flex-direction: column;
`;

const PaymentOption = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const RadioButton = styled.input`
  margin-right: 10px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const CardElementContainer = styled.div`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const CardNumberElementStyled = styled(CardNumberElement)`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const CardExpiryElementStyled = styled(CardExpiryElement)`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
`;

const CardCvcElementStyled = styled(CardCvcElement)`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
`;

const CheckoutForm = () => {
  const { state, clearLocalCart } = useCart();
  const [userData, setUserData] = useState({ name: '', address: '', email: '', country: 'South Africa', city: '', province: '', postalCode: '', phone: '' });
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingData, setBillingData] = useState({ address: '', city: '', province: '', postalCode: '' });
  const [paymentMethod, setPaymentMethod] = useState('payfast');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe has not been properly initialized.");
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);

    if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
      setError("Card elements not found.");
      return;
    }

    try {
      // Send user data and cart items to backend
      const { data: clientSecret } = await axios.post('/api/checkout', { userData, cartItems: state.items });

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: userData.name,
            address: {
              line1: billingSameAsShipping ? userData.address : billingData.address,
              city: billingSameAsShipping ? userData.city : billingData.city,
              state: billingSameAsShipping ? userData.province : billingData.province,
              postal_code: billingSameAsShipping ? userData.postalCode : billingData.postalCode,
            },
            email: userData.email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message || 'An error occurred');
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          clearLocalCart();
          navigate('/order-confirmation');
        }
      }
    } catch (err) {
      setError('Error processing the order. Please try again.');
    }
  };

  return (
    <CheckoutContainer>
      <CheckoutTitle>Checkout</CheckoutTitle>
      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>Contact</SectionTitle>
          <Input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <CheckboxContainer>
            <input type="checkbox" /> <span>Email me with news and offers</span>
          </CheckboxContainer>
        </Section>
        <Section>
          <SectionTitle>Delivery</SectionTitle>
          <Input type="text" name="country" value="South Africa" readOnly />
          <Input type="text" name="firstName" placeholder="First name" onChange={handleChange} required />
          <Input type="text" name="lastName" placeholder="Last name" onChange={handleChange} required />
          <Input type="text" name="company" placeholder="Company (optional)" onChange={handleChange} />
          <Input type="text" name="address" placeholder="Address" onChange={handleChange} required />
          <Input type="text" name="apartment" placeholder="Apartment, suite, etc. (optional)" onChange={handleChange} />
          <Input type="text" name="city" placeholder="City" onChange={handleChange} required />
          <Input type="text" name="province" placeholder="Province" onChange={handleChange} required />
          <Input type="text" name="postalCode" placeholder="Postal code" onChange={handleChange} required />
          <Input type="text" name="phone" placeholder="Phone" onChange={handleChange} required />
          <CheckboxContainer>
            <input type="checkbox" /> <span>Save this information for next time</span>
          </CheckboxContainer>
        </Section>
        <Section>
          <SectionTitle>Payment</SectionTitle>
          <PaymentOptions>
            <PaymentOption>
              <RadioButton
                type="radio"
                name="paymentMethod"
                value="payfast"
                checked={paymentMethod === 'payfast'}
                onChange={() => setPaymentMethod('payfast')}
              />
              Payfast
            </PaymentOption>
            <PaymentOption>
              <RadioButton
                type="radio"
                name="paymentMethod"
                value="payjustnow"
                checked={paymentMethod === 'payjustnow'}
                onChange={() => setPaymentMethod('payjustnow')}
              />
              PayJustNow
            </PaymentOption>
            <PaymentOption>
              <RadioButton
                type="radio"
                name="paymentMethod"
                value="payflex"
                checked={paymentMethod === 'payflex'}
                onChange={() => setPaymentMethod('payflex')}
              />
              Payflex
            </PaymentOption>
            <PaymentOption>
              <RadioButton
                type="radio"
                name="paymentMethod"
                value="ozow"
                checked={paymentMethod === 'ozow'}
                onChange={() => setPaymentMethod('ozow')}
              />
              Ozow
            </PaymentOption>
          </PaymentOptions>
        </Section>
        <Section>
          <SectionTitle>Billing address</SectionTitle>
          <PaymentOptions>
            <PaymentOption>
              <RadioButton
                type="radio"
                name="billingSameAsShipping"
                value="same"
                checked={billingSameAsShipping}
                onChange={() => setBillingSameAsShipping(true)}
              />
              Same as shipping address
            </PaymentOption>
            <PaymentOption>
              <RadioButton
                type="radio"
                name="billingSameAsShipping"
                value="different"
                checked={!billingSameAsShipping}
                onChange={() => setBillingSameAsShipping(false)}
              />
              Use a different billing address
            </PaymentOption>
          </PaymentOptions>
          {!billingSameAsShipping && (
            <>
              <Input type="text" name="address" placeholder="Address" onChange={handleBillingChange} required />
              <Input type="text" name="city" placeholder="City" onChange={handleBillingChange} required />
              <Input type="text" name="province" placeholder="Province" onChange={handleBillingChange} required />
              <Input type="text" name="postalCode" placeholder="Postal code" onChange={handleBillingChange} required />
            </>
          )}
        </Section>
        <CardElementContainer>
          <CardNumberElementStyled options={{ style: { base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } }, invalid: { color: '#9e2146' } } }} />
        </CardElementContainer>
        <FlexContainer>
          <CardExpiryElementStyled options={{ style: { base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } }, invalid: { color: '#9e2146' } } }} />
          <CardCvcElementStyled options={{ style: { base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } }, invalid: { color: '#9e2146' } } }} />
        </FlexContainer>
        <Button type="submit">Place Order</Button>
        {error && <p>{error}</p>}
      </Form>
    </CheckoutContainer>
  );
};

const Checkout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Checkout;
