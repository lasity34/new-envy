import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import axiosInstance from '../axiosInstance';
import { useCart } from '../context/CartContext';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
`;

const Details = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 20px;
`;

const DetailItem = styled.div`
  margin-bottom: 10px;
`;

const DetailLabel = styled.span`
  font-weight: bold;
  color: #555;
`;

const Button = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 12px 24px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #555;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  font-weight: bold;
`;

const SectionTitle = styled.h3`
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 15px;
`;

const CartSummary = styled.div`
  margin-top: 20px;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const TotalPrice = styled.div`
  font-weight: bold;
  text-align: right;
  margin-top: 15px;
  font-size: 1.2em;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

interface UserDetails {
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  phone: string;
}

const CheckoutConfirmation: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { state, clearLocalCart } = useCart();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/details');
        console.log('User details response:', response.data);
        setUserDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('Failed to load user details. Please try again.');
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleConfirmOrder = async () => {
    if (!userDetails) {
      setError('User details are not available. Please try again.');
      return;
    }

    try {
      const response = await axiosInstance.post('/api/checkout/mock-checkout', {
        userData: userDetails,
        cartItems: state.items,
      });

      if (response.data.success) {
        clearLocalCart();
        navigate(`/order-confirmation/${response.data.orderId}`);
      } else {
        setError('Checkout failed. Please try again.');
      }
    } catch (error) {
      console.error('Error processing the order:', error);
      setError('An error occurred while processing your order. Please try again.');
    }
  };

  if (loading) {
    return <Container>Loading...</Container>;
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
        <Link to="/checkout">
          <Button>Return to Checkout</Button>
        </Link>
      </Container>
    );
  }

  if (!userDetails) {
    return (
      <Container>
        <ErrorMessage>User details are not available. Please try again.</ErrorMessage>
        <Link to="/checkout">
          <Button>Return to Checkout</Button>
        </Link>
      </Container>
    );
  }

  const totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Container>
      <Title>Confirm Your Order</Title>
      <Details>
        <SectionTitle>Shipping Details</SectionTitle>
        <DetailItem>
          <DetailLabel>Name:</DetailLabel> {userDetails.first_name} {userDetails.last_name}
        </DetailItem>
        <DetailItem>
          <DetailLabel>Address:</DetailLabel> {userDetails.address}
        </DetailItem>
        <DetailItem>
          <DetailLabel>City:</DetailLabel> {userDetails.city}
        </DetailItem>
        <DetailItem>
          <DetailLabel>Province:</DetailLabel> {userDetails.province}
        </DetailItem>
        <DetailItem>
          <DetailLabel>Postal Code:</DetailLabel> {userDetails.postal_code}
        </DetailItem>
        <DetailItem>
          <DetailLabel>Phone:</DetailLabel> {userDetails.phone}
        </DetailItem>
        <DetailItem>
          <DetailLabel>Email:</DetailLabel> {userDetails.email}
        </DetailItem>
      </Details>
      <CartSummary>
        <SectionTitle>Order Summary</SectionTitle>
        {state.items.map((item) => (
          <CartItem key={item.id}>
            <span>{item.name} x {item.quantity}</span>
            <span>R {(item.price * item.quantity).toFixed(2)}</span>
          </CartItem>
        ))}
        <TotalPrice>Total: R {totalPrice.toFixed(2)}</TotalPrice>
      </CartSummary>
      <ButtonContainer>
        <Link to="/cart">
          <Button>Back to Cart</Button>
        </Link>
        <div>
          <Button onClick={handleConfirmOrder}>Confirm Order</Button>
          <Link to="/checkout">
            <Button>Edit Details</Button>
          </Link>
        </div>
      </ButtonContainer>
    </Container>
  );
};

export default CheckoutConfirmation;