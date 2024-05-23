// src/auth/Signup.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUser } from '../context/UserContext';
import Notification from '../components/Notification';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #fff;
`;

const FormWrapper = styled.div`
  background: white;
  padding: 40px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 2.5rem;
  font-weight: 400;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
`;

const Button = styled.button`
  padding: 0.8em 0.4em;
  background-color: #2e2c2c;
  width: 40%;
  color: white;
  border: none;
  justify-self: center;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 20px;

  &:hover {
    background-color: #333;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Text = styled.p`
  margin-top: 20px;
`;

const StyledLink = styled(Link)`
  color: #000;
  text-decoration: underline;
  font-size: 1rem;

  &:hover {
    text-decoration: none;
  }
`;

interface NotificationState {
  message: string;
  show: boolean;
  type: 'success' | 'error';
}

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState<NotificationState>({ message: '', show: false, type: 'success' });
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, { username, email, password });
      setUser(response.data.user);
      navigate('/');
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        if (error.response.data.message === 'Email is already in use') {
          setNotification({ message: 'Email is already in use', show: true, type: 'error' });
        } else if (error.response.data.message === 'Username is already taken') {
          setNotification({ message: 'Username is already taken', show: true, type: 'error' });
        } else {
          setNotification({ message: 'Signup failed', show: true, type: 'error' });
        }
      } else {
        setNotification({ message: 'An unknown error occurred', show: true, type: 'error' });
      }

      // Hide notification after 5 seconds
      setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 5000);
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>Signup</Title>
        <Form onSubmit={handleSignup}>
          <Input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Username"
            required 
          />
          <Input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email"
            required 
          />
          <Input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password"
            required 
          />
          <Notification message={notification.message} show={notification.show} type={notification.type} />
          <ButtonContainer>
            <Button type="submit">Sign up</Button>
          </ButtonContainer>
        </Form>
        <Text>Already have an account? <StyledLink to="/login">Login here</StyledLink></Text>
      </FormWrapper>
    </Container>
  );
};

export default Signup;
