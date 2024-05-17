// src/auth/login.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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

const Label = styled.label`
  margin-bottom: 10px;
  font-weight: bold;
  display: block;
  text-align: left;
  font-size: 1rem;
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
  padding: 10px;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 20px;

  &:hover {
    background-color: #333;
  }
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

const ForgotPasswordLink = styled(Link)`
  color: #000;
  text-decoration: underline;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 20px;

  &:hover {
    text-decoration: none;
  }
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      alert('Login successful');
      localStorage.setItem('token', response.data.token);
      // Redirect to another page or dashboard
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>Login</Title>
        <Form onSubmit={handleLogin}>
          <Input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            required 
          />
          <Input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder='Password'
            required 
          />
          <ForgotPasswordLink to="/forgot-password">Forgot your password?</ForgotPasswordLink>
          <Button type="submit">Sign in</Button>
        </Form>
        <Text> <StyledLink to="/signup">Create account</StyledLink></Text>
      </FormWrapper>
    </Container>
  );
};

export default Login;
