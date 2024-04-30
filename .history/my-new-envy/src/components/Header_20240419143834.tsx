import styled from "styled-components";
import { Link } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { HiOutlineShoppingCart } from "react-icons/hi";

// Define basic styled components
const HeaderContainer = styled.header`
  font-family: "Crimson Text", serif;
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
  width: 80%;
  display: flex;
  justify-content: space-between;
  color: black;
`;

const NavLinks = styled.ul`
  list-style: none;
  display: flex;
`;

const IconNavLinks = styled.ul`
  display: flex;
  justify-content: space-around;
  width: 70%;
`;

const IconNavLink = styled.li`
  list-style: none;
  color: black;

  a {
    color: black;
    text-decoration: none;
    font-weight: bold;
    font-size: 1.4rem;

    &:hover {
      color: gold; // Change color on hover
    }
  }
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
            <CapImage src="images/cap-logo.png" alt="Queue" />
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
