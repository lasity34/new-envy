// src/components/MyOrders.tsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const OrderItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
`;

const Button = styled(Link)`
  display: inline-block;
  padding: 10px 15px;
  background-color: #333;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-right: 10px;
`;

interface Order {
  id: number;
  status: string;
  total_amount: number | string;
  created_at: string;
  tracking_number?: string;
}

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get('/api/checkout/orders');
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatAmount = (amount: number | string): string => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return isNaN(numericAmount) ? 'N/A' : numericAmount.toFixed(2);
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container>
      <h1>My Orders</h1>
      {orders.map((order) => (
        <OrderItem key={order.id}>
          <h2>Order #{order.id}</h2>
          <p>Status: {order.status}</p>
          <p>Total: R{formatAmount(order.total_amount)}</p>
          <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
          {order.tracking_number && (
            <Button to={`/track-order/${order.tracking_number}`}>
              Track Order
            </Button>
          )}
          <Button to={`/order-confirmation/${order.id}`}>
            View Details
          </Button>
        </OrderItem>
      ))}
    </Container>
  );
};

export default MyOrders;