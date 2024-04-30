import styled from "styled-components";
import { Link } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { HiOutlineShoppingCart } from "react-icons/hi";

const HeaderContainer = styled.header`
  font-family: "Caveat", cursive;
  color: black;
  padding: 20px 40px; // Consistent padding
  display: flex;
  justify-content: space-between; // Horizontal alignment
  align-items: center; // Vertical alignment
  width: 100%; // Full width
`;

const BannerContainer = styled.div`
  display: flex;
  justify-content: space-between; // Ensures items are spread from left to right
  align-items: center; // Vertical centering
  width: 100%; // Full width
`;

const SearchContainer = styled.div`
  flex: 1; // Flexible space
`;

const LogoContainer = styled.div`
  flex: 1; // Flexible space
  display: flex;
  justify-content: center; // Center horizontally
  align-items: center; // Center vertically
`;

const AccountCartContainer = styled.div`
  flex: 1; // Flexible space
  display: flex;
  justify-content: center; // Center horizontally
  align-items: center; // Center vertically
`;

const Nav = styled.nav`
  width: 100%; // Full width
  display: flex;
  justify-content: center; // Center navigation links horizontally
  align-items: center; // Center vertically
  margin: 0; // Remove margin to ensure centering
`;

const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  justify-content: center; // Ensures links are centered within the navigation
  align-items: center; // Vertical alignment
  padding: 0; // Removes padding
`;

const NavLink = styled.li`
  margin: 0 20px; // Provides horizontal spacing
  a {
    color: #433f3e;
    text-decoration: none;
    font-weight: bold;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 50%;
      width: 0;
      height: 2px;
      background-color: black;
      transition: width 0.5s ease, left 0.5s ease;
      transform: translateX(-50%);
    }

    &:hover::after {
      width: 100%;
    }
  }
`;

const CapImage = styled.img`
  width: 100px; // Adjust as needed
`;

const Header = () => {
  return (
    <HeaderContainer>
      <BannerContainer>
        <SearchContainer></SearchContainer>
        <LogoContainer>
          <Link to="/">
            <CapImage src="images/logo.png" alt="Queue Caps Logo" />
          </Link>
        </LogoContainer>
        <AccountCartContainer>
          <IconNavLink>
            <Link to="/account">
              <CiUser />
            </Link>
            <Link to="/cart">
              <HiOutlineShoppingCart />
            </Link>
          </IconNavLink>
        </AccountCartContainer>
      </BannerContainer>
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
