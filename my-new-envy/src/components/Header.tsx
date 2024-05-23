import { Link as RouterLink, useLocation } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';
import { CiUser } from 'react-icons/ci';
import { MdOutlineShoppingBag, MdSettings } from 'react-icons/md'; // Import a settings icon
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';

const HeaderContainer = styled.header`
  font-family: "Caveat", cursive;
  color: black;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  border-bottom: solid 1px #eceaea;
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
  width: 125%;
`;

const AccountCartContainer = styled.div`
  display: flex;
  align-items: center; // Ensure icons are vertically centered
  list-style: none;
  width: 30%; // Adjust width to fit the content
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
  align-items: center; // Ensure icons are vertically centered
  padding: 0; // Remove any padding that might cause a gap
`;

const IconNavLink = styled.li`
  list-style: none;
  color: black;

  a {
    color: black;
    text-decoration: none; 
    font-size: 1.9rem;
    padding: 0 10px;

    &:hover {
      color: black;
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
      bottom: -5px;
      left: 0;
      right: 0;
      width: 0;
      height: 2px;
      background-color: black;
      transition: width 0.5s ease, left 0.5s ease;
      transform: translateX(-50%);
    }

    &:hover::after {
      width: 100%;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

const CapImage = styled.img`
  width: 150px;
`;

const CartIconContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ItemCountBadge = styled.span`
  position: absolute;
  top: 15px;
  right: 9px;
  background-color: black;
  color: white;
  border: 2px solid #333;
  font-size: 0.8rem;
  padding: 1px 5px 1px 4px;
  border-radius: 50%;
  font-weight: bold;
  text-align center;
  z-index: 1;
`;

const DropdownContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const DropdownIcon = styled(MdSettings)`
  font-size: 1.8rem;
  margin-left: 10px;
  margin-bottom: 6px;
`;

const DropdownMenu = styled.div<{ show: boolean }>`
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: ${(props) => (props.show ? 'block' : 'none')};
  width: 150px; /* Ensure the width is consistent */
`;

const DropdownItem = styled.div`
  padding: 10px 20px;
  color: black;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap; /* Ensure each item stays on one line */
  display: block; /* Ensure items are stacked vertically */
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background-color: black;
    transition: width 0.5s ease, left 0.5s ease;
    transform: translateX(-50%);
  }

  &:hover::after {
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Header = () => {
  const location = useLocation();
  const { state } = useCart();
  const { user, logout } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const itemCount = state.items.reduce((acc, item) => acc + item.quantity, 0);
  const isHomePage = location.pathname === '/';
  const hideNav = location.pathname.includes('/products/') || location.pathname === '/cart';

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

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
          {user && (
            <DropdownContainer onClick={toggleDropdown} ref={dropdownRef}>
              <DropdownIcon />
              <DropdownMenu show={showDropdown}>
                <DropdownItem onClick={() => setShowDropdown(false)} as={RouterLink} to="/account">
                  Account Details
                </DropdownItem>
                <DropdownItem onClick={() => setShowDropdown(false)} as={RouterLink} to="/orders">
                  Order History
                </DropdownItem>
                <DropdownItem onClick={() => { setShowDropdown(false); logout(); }}>
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </DropdownContainer>
          )}
          <IconNavLinks>
            {!user && (
              <IconNavLink>
                <RouterLink to="/login">
                  <CiUser />
                </RouterLink>
              </IconNavLink>
            )}
            <IconNavLink>
              <CartIconContainer>
                <RouterLink to="/cart">
                  <MdOutlineShoppingBag />
                  {itemCount > 0 && (
                    <ItemCountBadge>{itemCount}</ItemCountBadge>
                  )}
                </RouterLink>
              </CartIconContainer>
            </IconNavLink>
          </IconNavLinks>
        </AccountCartContainer>
      </BannerContainer>
      {!hideNav && (
        <Nav>
          <NavLinks>
            <NavLink><RouterLink to="/">Home</RouterLink></NavLink>
            {isHomePage ? (
              <NavLink><Link to="#featured" smooth>Shop</Link></NavLink>
            ) : (
              <NavLink><RouterLink to="/#featured">Shop</RouterLink></NavLink>
            )}
            {isHomePage ? (
              <NavLink><Link to="#about" smooth>About Us</Link></NavLink>
            ) : (
              <NavLink><RouterLink to="/#about">About Us</RouterLink></NavLink>
            )}
            {isHomePage ? (
              <NavLink><Link to="#contact" smooth>Contact</Link></NavLink>
            ) : (
              <NavLink><RouterLink to="/#contact">Contact</RouterLink></NavLink>
            )}
          </NavLinks>
        </Nav>
      )}
    </HeaderContainer>
  );
};

export default Header;
