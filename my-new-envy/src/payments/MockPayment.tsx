import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const formatExpiryDate = (value: string) => {
  const cleanedValue = value.replace(/\D/g, '');
  const match = cleanedValue.match(/^(\d{0,2})(\d{0,2})$/);
  if (match) {
    const part1 = match[1];
    const part2 = match[2];
    if (part2) {
      return `${part1}/${part2}`;
    }
    return part1;
  }
  return value;
};

const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>, setUserData: React.Dispatch<React.SetStateAction<UserData>>) => {
  const formattedValue = formatExpiryDate(e.target.value);
  setUserData((prevData: UserData) => ({ ...prevData, expiry: formattedValue }));
};

const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>, setUserData: React.Dispatch<React.SetStateAction<UserData>>) => {
  const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
  if (value.length <= 16) {
    setUserData((prevData: UserData) => ({ ...prevData, cardNumber: value }));
  }
};

const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>, setUserData: React.Dispatch<React.SetStateAction<UserData>>) => {
  const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
  if (value.length <= 3) {
    setUserData((prevData: UserData) => ({ ...prevData, cvc: value }));
  }
};

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

type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  address: string;
  apartment: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

const MockPayment = () => {
  const { state, clearCart } = useCart();
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
    country: 'South Africa',
    address: '',
    apartment: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });
  const [saveInfo, setSaveInfo] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaveInfo(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/checkout/mock-checkout', {
        userData,
        cartItems: state.items,
      });

      if (response.data.success) {
        if (saveInfo) {
          localStorage.setItem('userData', JSON.stringify(userData));
        }
        clearCart();
        navigate('/order-confirmation');
      } else {
        console.error('Checkout failed');
      }
    } catch (error) {
      console.error('Error processing the order:', error);
    }
  };

  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
  }, []);

  return (
    <CheckoutContainer>
      <CheckoutTitle>Checkout</CheckoutTitle>
      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>Contact</SectionTitle>
          <Input type="email" name="email" placeholder="Email" value={userData.email} onChange={handleChange} required />
          <div>
            <input type="checkbox" checked={saveInfo} onChange={handleCheckboxChange} /> <span>Email me with news and offers</span>
          </div>
        </Section>
        <Section>
          <SectionTitle>Delivery</SectionTitle>
          <Input type="text" name="country" value="South Africa" readOnly />
          <Input type="text" name="firstName" placeholder="First name" value={userData.firstName} onChange={handleChange} required />
          <Input type="text" name="lastName" placeholder="Last name" value={userData.lastName} onChange={handleChange} required />
          <Input type="text" name="address" placeholder="Address" value={userData.address} onChange={handleChange} required />
          <Input type="text" name="apartment" placeholder="Apartment, suite, etc. (optional)" value={userData.apartment} onChange={handleChange} />
          <Input type="text" name="city" placeholder="City" value={userData.city} onChange={handleChange} required />
          <Input type="text" name="province" placeholder="Province" value={userData.province} onChange={handleChange} required />
          <Input type="text" name="postalCode" placeholder="Postal code" value={userData.postalCode} onChange={handleChange} required />
          <Input type="text" name="phone" placeholder="Phone" value={userData.phone} onChange={handleChange} required />
          <div>
            <input type="checkbox" /> <span>Save this information for next time</span>
          </div>
        </Section>
        <Section>
          <SectionTitle>Payment</SectionTitle>
          <div>
            <Input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              value={userData.cardNumber}
              onChange={(e) => handleCardNumberChange(e, setUserData)}
              required
            />
          </div>
          <div>
            <Input
              type="text"
              name="expiry"
              placeholder="Expiry Date (MM/YY)"
              value={userData.expiry}
              onChange={(e) => handleExpiryChange(e, setUserData)}
              required
            />
            <Input
              type="text"
              name="cvc"
              placeholder="CVC"
              value={userData.cvc}
              onChange={(e) => handleCvcChange(e, setUserData)}
              required
            />
          </div>
        </Section>
        <Button type="submit">Mock Payment</Button>
      </Form>
    </CheckoutContainer>
  );
};

export default MockPayment;
