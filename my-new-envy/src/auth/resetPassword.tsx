// src/auth/ResetPassword.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/reset-password/${token}`, { password });
      alert('Password has been reset successfully');
      navigate('/login');
    } catch (error) {
      alert('Failed to reset password');
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>Reset Password</Title>
        <Form onSubmit={handleResetPassword}>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            required
          />
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            required
          />
          <ButtonContainer>
            <Button type="submit">Reset Password</Button>
          </ButtonContainer>
        </Form>
      </FormWrapper>
    </Container>
  );
};

export default ResetPassword;
