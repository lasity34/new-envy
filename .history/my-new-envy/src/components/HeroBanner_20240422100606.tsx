import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const BannerContainer = styled.div`
  height: 60vh;
  display: flex;
  align-items: center;
  background-color: #000; // Consider a fallback color
`;

const Collage = styled.div`
  background-image: url('/path/to/collage.jpg'); // Path to your collage image
  width: 50%;
  height: 100%;
  background-size: cover;
  background-position: center;
`;

const Content = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  color: white;
`;

const Tagline = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.7);
`;

const ShopButton = styled(Link)`
  padding: 10px 20px;
  background-color: gold;
  color: #003366;
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
      <Collage /> {/* Collage part */}
      <Content>
        <Tagline>Explore Our Exclusive Caps</Tagline>
        <ShopButton to="/shop">Shop Now</ShopButton>
      </Content>
    </BannerContainer>
  );
};

export default HeroBanner;
