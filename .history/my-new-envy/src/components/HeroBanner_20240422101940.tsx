
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const BannerContainer = styled.div`
  width: 100vw; // Ensures it takes the full viewport width
  height: 100vh; // You can adjust the height as needed
  background-image: url('images/hero-background.png');
  background-size: cover; // Cover the entire area of the div
  background-repeat: no-repeat;
  background-position: center center; // Centers the background image
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  color: white;
  position: relative; // Added to ensure it positions relative to the viewport if needed
`;

const Tagline = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.7); // Enhances legibility over the hero image
`;

const ShopButton = styled(Link)`
  padding: 10px 20px;

  color: #003366; // Deep blue
  font-size: 1.5rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  text-decoration: none;

  &:hover {
    background-color: #f1c40f;
    color: #fff;
  }
`;

const HeroBanner = () => {
  return (
    <BannerContainer>
      <Tagline>Explore Our Exclusive Caps</Tagline>
      <ShopButton to="/shop">Shop Now</ShopButton>
    </BannerContainer>
  );
};

export default HeroBanner;
