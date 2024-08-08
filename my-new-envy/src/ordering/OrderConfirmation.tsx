import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  status: string;
  total_amount: number | string;
  created_at: string;
  items: OrderItem[];
}

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const formatPrice = (price: number): string => {
    return price.toFixed(2);
  };

  const calculateItemTotal = (item: OrderItem): number => {
    return item.quantity * item.price;
  };

  const calculateOrderTotal = (): number => {
    return order.items.reduce((total, item) => total + calculateItemTotal(item), 0);
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
        <TotalPrice>Total: R {formatPrice(calculateOrderTotal())}</TotalPrice>
      </OrderDetails>
    </ConfirmationContainer>
  );
};

export default OrderConfirmation;