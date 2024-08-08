import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import axiosInstance from '../axiosInstance';
import { AxiosError } from 'axios';
import styled from 'styled-components';

const CheckoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  background: #fff;
  width: 85%;
  max-width: 800px;
  margin: auto;
  font-family: "Crimson Text", serif;
`;

const CheckoutTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 300;
  margin-bottom: 20px;
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
  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-bottom: 10px;
`;

type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

const MockPayment: React.FC = () => {
  const { state, clearLocalCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    setUserData(prev => ({ ...prev, cardNumber: value }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    const formattedValue = value.length > 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;
    setUserData(prev => ({ ...prev, expiry: formattedValue }));
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setUserData(prev => ({ ...prev, cvc: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      setError('Please log in to complete your order.');
      return;
    }

    try {
      // Save user details
      await axiosInstance.post('/api/auth/details', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        address: userData.address,
        city: userData.city,
        province: userData.province,
        postalCode: userData.postalCode,
        phone: userData.phone,
        email: userData.email
      });

      console.log('User details saved successfully');

      // Process checkout
      const response = await axiosInstance.post('/api/checkout/mock-checkout', {
        userData,
        cartItems: state.items,
      });

      if (response.data.success) {
        localStorage.setItem('userData', JSON.stringify(userData));
        clearLocalCart();
        navigate(`/order-confirmation/${response.data.orderId}`, { state: { fromCheckout: true } });
      } else {
        setError('Checkout failed. Please try again.');
        console.error('Checkout failed');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error details:', error.response?.data);
        if (error.response?.status === 401) {
          setError('Please log in to complete your order.');
        } else {
          setError(`Error processing the order: ${error.response?.data?.message || error.message}`);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Error processing the order:', error);
    }
  };

  return (
    <CheckoutContainer>
      <CheckoutTitle>Checkout</CheckoutTitle>
      {!user && (
        <ErrorMessage>
          Please <Link to="/login">log in</Link> to complete your order.
        </ErrorMessage>
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>Contact</SectionTitle>
          <Input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={userData.email} 
            onChange={handleChange} 
            required 
          />
        </Section>
        <Section>
          <SectionTitle>Delivery</SectionTitle>
          <Input 
            type="text" 
            name="firstName" 
            placeholder="First name" 
            value={userData.firstName} 
            onChange={handleChange} 
            required 
          />
          <Input 
            type="text" 
            name="lastName" 
            placeholder="Last name" 
            value={userData.lastName} 
            onChange={handleChange} 
            required 
          />
          <Input 
            type="text" 
            name="address" 
            placeholder="Address" 
            value={userData.address} 
            onChange={handleChange} 
            required 
          />
          <Input 
            type="text" 
            name="city" 
            placeholder="City" 
            value={userData.city} 
            onChange={handleChange} 
            required 
          />
          <Input 
            type="text" 
            name="province" 
            placeholder="Province" 
            value={userData.province} 
            onChange={handleChange} 
            required 
          />
          <Input 
            type="text" 
            name="postalCode" 
            placeholder="Postal code" 
            value={userData.postalCode} 
            onChange={handleChange} 
            required 
          />
          <Input 
            type="tel" 
            name="phone" 
            placeholder="Phone" 
            value={userData.phone} 
            onChange={handleChange} 
            required 
          />
        </Section>
        <Section>
          <SectionTitle>Payment</SectionTitle>
          <Input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            value={userData.cardNumber}
            onChange={handleCardNumberChange}
            required
          />
          <Input
            type="text"
            name="expiry"
            placeholder="Expiry Date (MM/YY)"
            value={userData.expiry}
            onChange={handleExpiryChange}
            required
          />
          <Input
            type="text"
            name="cvc"
            placeholder="CVC"
            value={userData.cvc}
            onChange={handleCvcChange}
            required
          />
        </Section>
        <Button type="submit" disabled={!user}>
          {user ? 'Complete Order' : 'Login to Checkout'}
        </Button>
      </Form>
    </CheckoutContainer>
  );
};

export default MockPayment;