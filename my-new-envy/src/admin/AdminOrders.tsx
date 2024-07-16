// src/admin/AdminOrders.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;

  th, td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  margin-right: 10px;
  font-size: 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

const BackButton = styled(Button)`
  background-color: #008CBA;
  margin-bottom: 20px;

  &:hover {
    background-color: #007BB5;
  }
`;

const Select = styled.select`
  padding: 8px;
  font-size: 1rem;
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
  user_id: number;
  first_name: string;
  last_name: string;
  status: string;
  total_amount: number | string;
  created_at: string;
  items: OrderItem[];
}

const AdminOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/checkout/admin/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setMessage('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/checkout/admin/orders/${orderId}/status`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      setMessage('Order status updated successfully.');
    } catch (error) {
      console.error('Error updating order status:', error);
      setMessage('Failed to update order status.');
    }
  };

  const formatTotalAmount = (amount: number | string): string => {
    if (typeof amount === 'number') {
      return amount.toFixed(2);
    }
    if (typeof amount === 'string') {
      const parsedAmount = parseFloat(amount);
      return isNaN(parsedAmount) ? amount : parsedAmount.toFixed(2);
    }
    return 'N/A';
  };



  return (
    <Container>
      <BackButton onClick={() => navigate('/admin/dashboard')}>Back to Admin Dashboard</BackButton>
      <Title>Admin Orders Management</Title>
      {message && <p>{message}</p>}
      {loading ? <p>Loading...</p> : (
        <Table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{`${order.first_name} ${order.last_name}`}</td>
                <td>R{formatTotalAmount(order.total_amount)}</td>
                <td>{order.status}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
                <td>
                  <ul>
                    {order.items && order.items.map((item, index) => (
                      <li key={index}>
                        {item.product_name}, Quantity: {item.quantity}, Price: R{item.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <Select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};



export default AdminOrders;