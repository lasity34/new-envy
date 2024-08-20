import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const ConfirmationContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h2`
  color: #333;
  text-align: center;
`;

const OrderDetails = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
  margin-top: 20px;
`;


const ItemList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ItemListItem = styled.li`
  border-bottom: 1px solid #eee;
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  &:last-child {
    border-bottom: none;
  }
`;

const TotalPrice = styled.div`
  font-weight: bold;
  text-align: right;
  margin-top: 20px;
  font-size: 1.2em;
`;

const Button = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  border-radius: 4px;
  text-decoration: none;
  display: inline-block;
`;

const TrackButton = styled(Button)`
  background-color: #4CAF50;
`;

const HomeButton = styled(Button)`
  background-color: #007bff;
  margin-right: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number | string;
}

interface Order {
  id: number;
  status: string;
  total_amount: number | string;
  created_at: string;
  items: OrderItem[];
  tracking_number: string;
  estimated_delivery_date: string;
  shipping_cost: number | string;
}

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log(`Fetching order details for order ID: ${orderId}`);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/checkout/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Received order data:', response.data);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details. Please try again later.');
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!order) {
    return <div>Loading order details...</div>;
  }

  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  const calculateItemTotal = (item: OrderItem): number => {
    const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
    return item.quantity * (isNaN(itemPrice) ? 0 : itemPrice);
  };

  const calculateSubtotal = (): number => {
    return order.items.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const calculateTotalWithShipping = (): number => {
    const subtotal = calculateSubtotal();
    const shippingCost = typeof order.shipping_cost === 'string' ? parseFloat(order.shipping_cost) : order.shipping_cost;
    return subtotal + (isNaN(shippingCost) ? 0 : shippingCost);
  };

  return (
    <ConfirmationContainer>
      <Title>Order Confirmation</Title>
      <OrderDetails>
        <p>Thank you for your order!</p>
        <p>Order ID: {order.id}</p>
        <p>Status: {order.status}</p>
        <p>Date: {new Date(order.created_at).toLocaleString()}</p>
        <h3>Order Items:</h3>
        <ItemList>
          {order.items && order.items.map((item) => (
            <ItemListItem key={item.id}>
              <span>{item.product_name} (x{item.quantity})</span>
              <span>R {formatPrice(calculateItemTotal(item))}</span>
            </ItemListItem>
          ))}
        </ItemList>
        <TotalPrice>Subtotal: R {formatPrice(calculateSubtotal())}</TotalPrice>
        <TotalPrice>Shipping: R {formatPrice(order.shipping_cost)}</TotalPrice>
        <TotalPrice>Total: R {formatPrice(calculateTotalWithShipping())}</TotalPrice>
        {order.tracking_number && (
          <div>
            <p>Tracking Number: {order.tracking_number}</p>
            <p>Estimated Delivery: {new Date(order.estimated_delivery_date).toLocaleDateString()}</p>
          </div>
        )}
      </OrderDetails>
      <ButtonContainer>
        <HomeButton onClick={() => navigate('/')}>
          Back to Home
        </HomeButton>
        {order.tracking_number && (
          <TrackButton as={Link} to={`/track-order/${order.tracking_number}`}>
            Track Shipment
          </TrackButton>
        )}
      </ButtonContainer>
    </ConfirmationContainer>
  );
};

export default OrderConfirmation;