import { Link as RouterLink, useLocation } from 'react-router-dom';
import { CiUser } from 'react-icons/ci';
import { MdOutlineShoppingBag } from 'react-icons/md';
import styled from 'styled-components';

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

    &::after {
      content: '';
      position: absolute;
      bottom: -5px; // Distance from the bottom of the link text
      left: 0;
      right: 0;
      width: 0; // Start with no width
      height: 2px;
      background-color: black;
      transition: width 0.5s ease, left 0.5s ease; // Animate the width and left position
      transform: translateX(-50%);
    }

    &:hover::after {
      width: 100%; // Full width on hover
      left: 50%; // Centering it with the left position during hover
      transform: translateX(-50%); // Ensure it grows from the center
    }
  }
`;

const CapImage = styled.img`
  width: 100px;
`;

const Header = () => {
  const location = useLocation(); // Hook to access the location object
  const hideNav = location.pathname.includes('/products/') || location.pathname === '/cart';

  return (
    <HeaderContainer>
      <BannerContainer>
        <SearchContainer></SearchContainer>
        <LogoContainer>
          <RouterLink to="/">
            <CapImage src="images/logo.png" alt="Queue" />
          </RouterLink>
        </LogoContainer>
        <AccountCartContainer>
          <IconNavLinks>
            <IconNavLink>
              <RouterLink to="/account">
                <CiUser />
              </RouterLink>
            </IconNavLink>
            <IconNavLink>
              <RouterLink to="/cart">
                <MdOutlineShoppingBag />
              </RouterLink>
            </IconNavLink>
          </IconNavLinks>
        </AccountCartContainer>
      </BannerContainer>
      {!hideNav && (
        <Nav>
          <NavLinks>
            <NavLink><RouterLink to="/">Home</RouterLink></NavLink>
            <NavLink><RouterLink to="/shop">Shop</RouterLink></NavLink>
            <NavLink><RouterLink to="/about">About Us</RouterLink></NavLink>
            <NavLink><RouterLink to="/contact">Contact</RouterLink></NavLink>
          </NavLinks>
        </Nav>
      )}
    </HeaderContainer>
  );
};

export default Header;
