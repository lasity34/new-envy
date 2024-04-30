
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Define basic styled components
const HeaderContainer = styled.header`
  background-color: #003366;  // Navy Blue
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
`;

const Nav = styled.nav`
  width: 80%
  display: flex;
  justify-content: space-between;
  
`;


const NavLinks = styled.ul`
  list-style: none;
  display: flex;
`;

const NavLink = styled.li`
  margin-left: 20px;

  a {
    color: white;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      color: gold;  // Change color on hover
    }
  }
`;

// Simplified Header component
const Header = () => {
  return (
    <HeaderContainer>
      <Nav>
      
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
