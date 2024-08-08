import React from 'react';
import styled from 'styled-components';
import { HashLink as Link } from 'react-router-hash-link';

const BannerContainer = styled.div`
  width: 100%;
  height: 60vh; // Reduced height for mobile
  background-image: url('images/hero-background.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  color: white;
  position: relative;

  @media (min-width: 768px) {
    height: 80vh; // Taller on larger screens
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4); // Darkens the background image
`;

const Content = styled.div`
  z-index: 1;
  padding: 0 20px;
`;

const Tagline = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.7);
  font-family: "Playfair Display", serif;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  margin-bottom: 30px;
  max-width: 600px;
  line-height: 1.5;

  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ShopButton = styled(Link)`
  padding: 12px 24px;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  background-color: transparent;
  border: 2px solid white;
  border-radius: 30px;
  text-decoration: none;
  transition: background-color 0.3s, color 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    background-color: white;
    color: black;
  }

  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const HeroBanner: React.FC = () => {
  return (
    <BannerContainer>
      <Overlay />
      <Content>
        <Tagline>Elevate Your Style with Envy Caps</Tagline>
        <Subtitle>
          Discover our exclusive collection of premium caps, designed for those who dare to stand out.
        </Subtitle>
        <ShopButton to="/#featured" smooth>Shop Now</ShopButton>
      </Content>
    </BannerContainer>
  );
};

export default HeroBanner;