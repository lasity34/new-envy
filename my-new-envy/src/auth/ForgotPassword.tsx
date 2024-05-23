// src/auth/ForgotPassword.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
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
  margin-bottom: 10px; /* Adjust margin to create space for notification */
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

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState<NotificationState>({ message: '', show: false, type: 'success' });

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email });
      setNotification({ message: 'Password reset email sent', show: true, type: 'success' });
    } catch (error) {
      setNotification({ message: 'Failed to send password reset email', show: true, type: 'error' });
    }

    // Hide notification after 5 seconds
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 3000);
  };

  return (
    <Container>
      <FormWrapper>
        <Title>Forgot Password</Title>
        <Form onSubmit={handleForgotPassword}>
          <Input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            required 
          />
          <Notification message={notification.message} show={notification.show} type={notification.type} />
          <ButtonContainer>
            <Button type="submit">Send Reset Link</Button>
          </ButtonContainer>
        </Form>
        <Text>Remembered your password? <StyledLink to="/login">Login here</StyledLink></Text>
      </FormWrapper>
    </Container>
  );
};

export default ForgotPassword;
