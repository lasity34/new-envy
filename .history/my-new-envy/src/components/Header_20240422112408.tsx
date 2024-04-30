import styled from "styled-components";
import { Link } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { MdOutlineShoppingBag } from "react-icons/md";

const HeaderContainer = styled.header`
  font-family: "Caveat", cursive;
  color: black;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center; // Ensure everything in the header is centered
  width: 100%;
  text-align: center; // Centers the text elements within flex items
`;

const BannerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const SearchContainer = styled.div`
  flex: 1;
  display: flex; // Makes sure the search container can align its children
  justify-content: center; // Centering the search bar or content inside the container
`;

const LogoContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center; // Ensure logo is centered
  align-items: center;
`;

const AccountCartContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center; // Ensure icons are centered
  align-items: center;
`;

const IconNavLinks = styled.ul`
  display: flex;
  justify-content: space-evenly; // This will ensure icons are evenly spaced
  align-items: center;
  list-style: none;
  padding: 0; // Removes padding
  width: 100%; // Ensure it uses the full width available in the container
`;

const IconNavLink = styled.li`
  margin: 0 10px; // Spacing between icons
  a {
    color: black;
    text-decoration: none;
    font-size: 1.7rem;
    display: inline-block;

    &:hover {
      color: #f1c40f; // Color change on hover
    }
  }
`;

const Nav = styled.nav`
  width: 100%;
  display: flex;
  justify-content: center; // Center navigation links horizontally
  align-items: center;
  margin-top: 20px; // Added margin for spacing between banner and nav
`;

const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  justify-content: center; // Ensures links are centered within the navigation
  align-items: center;
  padding: 0;
  width: 100%; // Full width to center all items properly
`;

const NavLink = styled.li`
  margin: 0 20px;
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
      transform: translateX(-50%);
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
          <IconNavLinks>
            <IconNavLink>
              <Link to="/account">
                <CiUser />
              </Link>
            </IconNavLink>
            <IconNavLink>
              <Link to="/cart">
              <MdOutlineShoppingBag />
              </Link>
            </IconNavLink>
          </IconNavLinks>
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
