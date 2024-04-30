import styled from "styled-components";
import { Link } from "react-router-dom";

// Define basic styled components
const HeaderContainer = styled.header`
  font-family: 'Crimson Text', serif;
  color: black;
  padding: 20px 40px; // Adjust the padding to match the spacing in the screenshot
  display: flex;
  justify-content: space-between; // Align items to the start and end of the header
  align-items: center; // Center items vertically
  flex-direction: column;
`;


const BannerContainer = styled.div`
display: flex;
`


const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1; // Allows the center to grow
`;

const AccountCartContainer = styled.div`
  display: flex;
  align-items: center;
  list-style: none;
`;

const Nav = styled.nav`
  width: 80%;
  display: flex;
  justify-content: space-between;
  color: black;
`;

const NavLinks = styled.ul`
  list-style: none;
  display: flex;
`;

const NavLink = styled.li`
  margin-left: 20px;

  a {
    color: black;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      color: gold; // Change color on hover
    }
  }
`;

// Simplified Header component
const Header = () => {
  return (
    <HeaderContainer>
      <BannerContainer>
        <div></div>

        <LogoContainer>
          <Link to="/">QUEUE</Link>
        </LogoContainer>

        <AccountCartContainer>
          <NavLink>
            <Link to="/account">Account</Link>
          </NavLink>
          <NavLink>
            <Link to="/cart">Shop</Link>
          </NavLink>
        </AccountCartContainer>
      </BannerContainer>
      <Nav>
        <NavLinks>
          <NavLink>
            <Link to="/">Home</Link>
          </NavLink>
          <NavLink>
            <Link to="/shop">Shop</Link>
          </NavLink>
          <NavLink>
            <Link to="/about">About Us</Link>
          </NavLink>
          <NavLink>
            <Link to="/contact">Contact</Link>
          </NavLink>
          <NavLink>
            <Link to="/faq">FAQs</Link>
          </NavLink>
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
