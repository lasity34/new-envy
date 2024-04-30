import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Styled components
const HeaderContainer = styled.header`
  background-color: #003366; /* Navy Blue */
  color: white;
  padding: 10px 20px;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: 24px;
  color: gold; /* Adjust the gold color as needed */
`;

const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
`;

const NavLink = styled.li`
  margin-left: 20px;

  a {
    color: white;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      color: gold; /* Adjust the gold color as needed */
    }
  }
`;

// Header Component
const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Nav>
        <Logo><Link to="/">CAPS STORE</Link></Logo>
        <NavLinks>
          <NavLink><Link to="/">Home</Link></NavLink>
          <NavLink><Link to="/shop">Shop</Link></NavLink>
          <NavLink><Link to="/about">About Us</Link></NavLink>
          <NavLink><Link to="/contact">Contact</Link></NavLink>
          <NavLink><Link to="/faq">FAQs</Link></NavLink>
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
