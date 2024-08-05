import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import axiosInstance from '../axiosInstance';
import { useCart } from '../context/CartContext';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h2`
  text-align: center;
`;

const Details = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
`;

const CheckoutConfirmation: React.FC = () => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { state, clearLocalCart } = useCart();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get('/api/user/details');
        setUserDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleConfirmOrder = async () => {
    try {
      const response = await axiosInstance.post('/api/checkout/mock-checkout', {
        userData: userDetails,
        cartItems: state.items,
      });

      if (response.data.success) {
        clearLocalCart();
        navigate(`/order-confirmation/${response.data.orderId}`);
      } else {
        alert('Checkout failed. Please try again.');
      }
    } catch (error) {
      console.error('Error processing the order:', error);
      alert('An error occurred while processing your order. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Title>Confirm Your Order</Title>
      <Details>
        <h3>Shipping Details</h3>
        <p>{userDetails.firstName} {userDetails.lastName}</p>
        <p>{userDetails.address}</p>
        <p>{userDetails.city}, {userDetails.province} {userDetails.postalCode}</p>
        <p>{userDetails.phone}</p>
      </Details>
      <Button onClick={handleConfirmOrder}>Confirm Order</Button>
      <Link to="/checkout">
        <Button>Edit Details</Button>
      </Link>
    </Container>
  );
};

export default CheckoutConfirmation;