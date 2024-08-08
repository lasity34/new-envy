import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axiosInstance from '../axiosInstance';
import { useUser } from '../context/UserContext';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #333;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #555;
  }
`;

const Message = styled.p<{ isError?: boolean }>`
  color: ${props => props.isError ? 'red' : 'green'};
  text-align: center;
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

const AccountDetails: React.FC = () => {
  const { user } = useUser();
  const [userDetails, setUserDetails] = useState<UserDetails>({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    city: '',
    province: '',
    postal_code: '',
    phone: '',
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/details');
        setUserDetails(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setMessage('Failed to load user details');
        setIsError(true);
      }
    };

    if (user) {
      fetchUserDetails();
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/auth/details', userDetails);
      setMessage('Details updated successfully');
      setIsError(false);
    } catch (error) {
      console.error('Error updating user details:', error);
      setMessage('Failed to update details');
      setIsError(true);
    }
  };

  return (
    <Container>
      <Title>Account Details</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="first_name"
          value={userDetails.first_name}
          onChange={handleChange}
          placeholder="First Name"
        />
        <Input
          type="text"
          name="last_name"
          value={userDetails.last_name}
          onChange={handleChange}
          placeholder="Last Name"
        />
        <Input
          type="email"
          name="email"
          value={userDetails.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <Input
          type="text"
          name="address"
          value={userDetails.address}
          onChange={handleChange}
          placeholder="Address"
        />
        <Input
          type="text"
          name="city"
          value={userDetails.city}
          onChange={handleChange}
          placeholder="City"
        />
        <Input
          type="text"
          name="province"
          value={userDetails.province}
          onChange={handleChange}
          placeholder="Province"
        />
        <Input
          type="text"
          name="postal_code"
          value={userDetails.postal_code}
          onChange={handleChange}
          placeholder="Postal Code"
        />
        <Input
          type="tel"
          name="phone"
          value={userDetails.phone}
          onChange={handleChange}
          placeholder="Phone"
        />
        <Button type="submit">Update Details</Button>
      </Form>
      {message && <Message isError={isError}>{message}</Message>}
    </Container>
  );
};

export default AccountDetails;