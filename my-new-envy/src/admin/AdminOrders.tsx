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
  tracking_number?: string;
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
      if (newStatus === 'shipped') {
        // Fetch order details
        const orderResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/checkout/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const orderDetails = orderResponse.data;

        // Create shipment
        const shipmentResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/shipping/create-shipment`, {
          orderId: orderId,
          deliveryAddress: orderDetails.deliveryAddress,
          items: orderDetails.items,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        // Update order with tracking information
        await axios.put(`${process.env.REACT_APP_API_URL}/api/checkout/admin/orders/${orderId}/tracking`, {
          trackingNumber: shipmentResponse.data.tracking_number,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      }

      // Update order status
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

  const downloadShipmentLabel = async (orderId: number) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/shipping/shipment-label/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `shipment-label-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading shipment label:', error);
      setMessage('Failed to download shipment label.');
    }
  };

  const viewTrackingInfo = async (trackingNumber: string) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/shipping/tracking/${trackingNumber}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // Display tracking information in a modal or new page
      console.log(response.data);
      // Implement a modal or navigation to display this data
      setMessage('Tracking information fetched successfully. Check console for details.');
    } catch (error) {
      console.error('Error fetching tracking information:', error);
      setMessage('Failed to fetch tracking information.');
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


  const getCustomerName = (order: Order) => {
    if (order.first_name && order.last_name) {
      return `${order.first_name} ${order.last_name}`;
    } else if (order.first_name) {
      return order.first_name;
    } else if (order.last_name) {
      return order.last_name;
    } else {
      return "N/A";
    }
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
              <th>Order Number</th>
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
                <td>{getCustomerName(order)}</td>
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
                    <option value="delivering">Delivering</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </Select>
                  {order.status === 'shipped' && (
                    <>
                      <Button onClick={() => downloadShipmentLabel(order.id)}>Download Label</Button>
                      {order.tracking_number && (
                        <Button onClick={() => viewTrackingInfo(order.tracking_number!)}>View Tracking</Button>
                      )}
                    </>
                  )}
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