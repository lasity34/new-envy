import styled from 'styled-components';
import { Link } from 'react-router-dom';

const BannerContainer = styled.div`
  width: 100vw; // Ensures it takes the full viewport width
  height: 100vh; // Sets the height to full viewport height
  background-image: url('images/hero-background.png'); // Background image for the banner
  background-size: cover; // Ensures the background covers the entire area
  background-repeat: no-repeat; // No repetition of the background image
  background-position: center center; // Centers the background image
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  color: white;
  position: relative; // Ensures proper positioning
`;

const Tagline = styled.h1`
  font-size: 2.5rem; // Large font size for main tagline
  margin-bottom: 20px; // Margin below the tagline
  text-shadow: 2px 2px 8px rgba(0,0,0,0.7); // Text shadow for better legibility
`;

const ShopButton = styled(Link)`
  padding: 10px 20px; // Padding for button size
  color: white; // Text color
  font-size: 1.5rem; // Font size for the text on the button
  font-weight: normal; // Normal font weight for thinner text appearance
  background-color: transparent; // Transparent background
  border: 1px solid white; // Thin white border
  border-radius: 10px; // Rounded corners for the button
  text-decoration: none; // No text decoration
  transition: background-color 0.3s, color 0.3s; // Smooth transition for hover effects

  &:hover {
    background-color: #f1c40f; // Background color changes on hover
    color: #003366; // Text color changes on hover
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
