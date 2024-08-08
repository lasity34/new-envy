import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
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
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState<{ message: string; show: boolean; type: 'success' | 'error' }>({
    message: '',
    show: false,
    type: 'success',
  });

  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(identifier, password);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data.message || 'Login failed';
        setNotification({ message: errorMessage, show: true, type: 'error' });
      } else {
        setNotification({ message: 'Login failed', show: true, type: 'error' });
      }
      setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 3000);
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>Login</Title>
        <Form onSubmit={handleLogin}>
          <Input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Email or Username"
            required
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <ForgotPasswordLink to="/forgot-password">Forgot your password?</ForgotPasswordLink>
          <ButtonContainer>
            <Button type="submit">Sign in</Button>
          </ButtonContainer>
        </Form>
        <Text>
          <StyledLink to="/signup">Create account</StyledLink>
        </Text>
      </FormWrapper>
      <Notification message={notification.message} show={notification.show} type={notification.type} />
    </Container>
  );
};

export default Login;