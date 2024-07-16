import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';
import { CiUser } from 'react-icons/ci';
import { MdOutlineShoppingBag, MdSettings, MdMenu, MdClose } from 'react-icons/md';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  font-family: "Caveat", cursive;
  color: black;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  border-bottom: solid 1px #eceaea;

  @media (min-width: 768px) {
    padding: 20px 40px;
  }
`;

const BannerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  @media (min-width: 768px) {
    justify-content: center;
    position: relative;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AccountCartContainer = styled.div`
  display: flex;
  align-items: center;
  list-style: none;

  @media (min-width: 768px) {
    position: absolute;
    right: 0;
  }
`;

const MenuIconContainer = styled.div`
  @media (min-width: 768px) {
    position: absolute;
    left: 0;
  }
`;

const Nav = styled.nav<{ $isOpen: boolean }>`
  width: 100%;
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  flex-direction: column;
  
  @media (min-width: 768px) {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
`;

const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;

  @media (min-width: 768px) {
    flex-direction: row;
    font-size: 1.4rem;
  }
`;

const IconNavLinks = styled.ul`
  display: flex;
  align-items: center;
  padding: 0;
`;

const IconNavLink = styled.li`
  list-style: none;
  color: black;
  margin-left: 15px;

  a {
    color: black;
    text-decoration: none; 
    font-size: 1.9rem;

    &:hover {
      color: #433f3e;
    }
  }
`;

const NavLink = styled.li`
  margin: 10px 0;

  @media (min-width: 768px) {
    margin: 0 0 0 20px;
  }

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
  width: 100px;

  @media (min-width: 768px) {
    width: 150px;
  }
`;

const CartIconContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ItemCountBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: black;
  color: white;
  border: 2px solid #333;
  font-size: 0.8rem;
  padding: 1px 5px;
  border-radius: 50%;
  font-weight: bold;
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
`;

const DropdownMenu = styled.div<{ $show: boolean }>`
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: ${(props) => (props.$show ? 'block' : 'none')};
  width: 150px;
`;

const DropdownItem = styled.div`
  padding: 10px 20px;
  color: black;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  display: block;
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

const MenuIcon = styled.div`
  display: block;
  font-size: 1.9rem;
  cursor: pointer;

  @media (min-width: 768px) {
    display: none;
  }
`;

const Header: React.FC = () => {
  const location = useLocation();
  const { state, clearCart } = useCart();
  const { user, logout } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const itemCount = state.items.reduce((acc, item) => acc + item.quantity, 0);
  const isHomePage = location.pathname === '/';
  const hideNav = location.pathname.includes('/products/') || location.pathname === '/cart';

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      clearCart();  // Clear the cart after successful logout
      setShowDropdown(false);
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <HeaderContainer>
      <BannerContainer>
        <MenuIconContainer>
          <MenuIcon onClick={toggleMenu}>
            {isMenuOpen ? <MdClose /> : <MdMenu />}
          </MenuIcon>
        </MenuIconContainer>
        <LogoContainer>
          <RouterLink to="/">
            <CapImage src="images/logo.png" alt="Queue" />
          </RouterLink>
        </LogoContainer>
        <AccountCartContainer>
          {user && (
            <DropdownContainer onClick={toggleDropdown} ref={dropdownRef}>
              <DropdownIcon />
              <DropdownMenu $show={showDropdown}>
                <DropdownItem onClick={() => setShowDropdown(false)} as={RouterLink} to="/account">
                  Account Details
                </DropdownItem>
                <DropdownItem onClick={() => setShowDropdown(false)} as={RouterLink} to="/orders">
                  Order History
                </DropdownItem>
                <DropdownItem onClick={handleLogout}>
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
     <Nav $isOpen={isMenuOpen}>
          <NavLinks>
            <NavLink><RouterLink to="/" onClick={() => setIsMenuOpen(false)}>Home</RouterLink></NavLink>
            {isHomePage ? (
              <NavLink><Link to="#featured" smooth onClick={() => setIsMenuOpen(false)}>Shop</Link></NavLink>
            ) : (
              <NavLink><RouterLink to="/#featured" onClick={() => setIsMenuOpen(false)}>Shop</RouterLink></NavLink>
            )}
            {isHomePage ? (
              <NavLink><Link to="#about" smooth onClick={() => setIsMenuOpen(false)}>About Us</Link></NavLink>
            ) : (
              <NavLink><RouterLink to="/#about" onClick={() => setIsMenuOpen(false)}>About Us</RouterLink></NavLink>
            )}
            {isHomePage ? (
              <NavLink><Link to="#contact" smooth onClick={() => setIsMenuOpen(false)}>Contact</Link></NavLink>
            ) : (
              <NavLink><RouterLink to="/#contact" onClick={() => setIsMenuOpen(false)}>Contact</RouterLink></NavLink>
            )}
          </NavLinks>
        </Nav>
      )}
    </HeaderContainer>
  );
};

export default Header;