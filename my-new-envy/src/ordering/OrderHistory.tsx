import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const OrderHistoryContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h2`
  color: #333;
  text-align: center;
`;

const OrderList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const OrderItem = styled.li`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 20px;
`;

const OrderLink = styled(Link)`
  color: #007bff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

interface Order {
  id: number;
  status: string;
  total_amount: number;
  created_at: string;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/checkout/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <OrderHistoryContainer>
      <Title>Order History</Title>
      <OrderList>
        {orders.map((order) => (
          <OrderItem key={order.id}>
            <h3>
              <OrderLink to={`/order-confirmation/${order.id}`}>
                Order #{order.id}
              </OrderLink>
            </h3>
            <p>Status: {order.status}</p>
            <p>Total: ${order.total_amount.toFixed(2)}</p>
            <p>Date: {new Date(order.created_at).toLocaleString()}</p>
          </OrderItem>
        ))}
      </OrderList>
    </OrderHistoryContainer>
  );
};

export default OrderHistory;