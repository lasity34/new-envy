import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { MdCategory, MdPeople, MdHistory } from 'react-icons/md';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Caveat", cursive;
  height: 100vh;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 40px;
`;

const LinkContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const AdminLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 20px;
  background-color: white;
  color: black;
  border: 1px solid black;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.5rem;
  width: 150px;
  height: 150px;
  text-align: center;

  &:hover {
    background-color: #0056b3;
    color: white;
  }
`;

const IconContainer = styled.div`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const GeneralAdminPage: React.FC = () => {
  return (
    <Container>
      <Title>Admin Dashboard</Title>
      <LinkContainer>
        <AdminLink to="/admin/products">
          <IconContainer>
            <MdCategory />
          </IconContainer>
          Products Management
        </AdminLink>
        <AdminLink to="/admin/users">
          <IconContainer>
            <MdPeople />
          </IconContainer>
          Users Management
        </AdminLink>
        <AdminLink to="/admin/orders">
          <IconContainer>
            <MdHistory />
          </IconContainer>
          Order History
        </AdminLink>
      </LinkContainer>
    </Container>
  );
};

export default GeneralAdminPage;
