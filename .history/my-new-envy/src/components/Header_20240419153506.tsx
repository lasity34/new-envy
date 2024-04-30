import styled from "styled-components";
import { Link } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { HiOutlineShoppingCart } from "react-icons/hi";

// Define basic styled components
const HeaderContainer = styled.header`
font-family: "Caveat", cursive;
  color: black;
  padding: 20px 40px; // Adjust the padding to match the spacing in the screenshot
  display: flex;
  justify-content: space-between; // Align items to the start and end of the header
  align-items: center; // Center items vertically
  flex-direction: column;
`;

const BannerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const SearchContainer = styled.div`
  width: 20%;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35%;
`;

const AccountCartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;
  width: 30%;
`;

const Nav = styled.nav`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-right: 8em;
  
`;

const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  font-size: 1.4rem;
`;

const IconNavLinks = styled.ul`
  display: flex;
  justify-content: center;
  width: 70%;
`;

const IconNavLink = styled.li`
  list-style: none;
  color: black;

  a {
    color: black;
    text-decoration: none; 
    font-size: 1.7rem;
    padding: 0 10px;

    &:hover {
      color: black; // Change color on hover
    }
  }
`;


const NavLink = styled.li`
  position: relative;
  margin-left: 20px;

  a {
    color: #433f3e;
    text-decoration: none;
    font-weight: bold;
    display: inline-block;
    position: relative;
    overflow: hidden; // Overflow hidden here to prevent pseudo-element from showing initially

    &::after {
      content: '';
      position: absolute;
      bottom: -5px; // Distance from the bottom of the link text
      left: 50%; // Start from the middle
      height: 2px;
      background-color: black;
      transition: all 0.5s ease; // Slow down the transition
      width: 0; // Initial width set to 0
      transform: translateX(-50%); // Center the pseudo-element
    }

    &:hover::after {
      width: 100%; // Full width on hover
      left: 0; // Reset left to fill the width
      transform: translateX(0%); // No need to translate on hover
    }
  }
`;



const CapImage = styled.img`
  width: 100px;
`;

// Simplified Header component
const Header = () => {
  return (
    <HeaderContainer>
      <BannerContainer>
        <SearchContainer></SearchContainer>

        <LogoContainer>
          <Link to="/">
            <CapImage src="images/logo.png" alt="Queue" />
          </Link>
        </LogoContainer>

        <AccountCartContainer>
          <IconNavLinks>
            <IconNavLink>
              <Link to="/account">
                <CiUser />
              </Link>
            </IconNavLink>
            <IconNavLink>
              <Link to="/cart">
                <HiOutlineShoppingCart />
              </Link>
            </IconNavLink>
          </IconNavLinks>
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
