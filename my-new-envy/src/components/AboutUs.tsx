import React from "react";
import styled, { keyframes } from "styled-components";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AboutSection = styled.section`
  padding: 2rem 1rem;
  font-family: "Playfair", serif;
  background-color: #f9f9f9;

  @media (min-width: 768px) {
    padding: 4rem 2rem;
  }
`;

const Section = styled.div<{ imageRight: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3rem;
  animation: ${fadeIn} 0.5s ease-out;

  @media (min-width: 768px) {
    flex-direction: ${({ imageRight }) => (imageRight ? "row-reverse" : "row")};
    justify-content: center;
  }
`;

const SectionHeader = styled.h2`
  width: 100%;
  text-align: center;
  font-size: 2rem;
  color: #433f3e;
  margin: 20px 0 40px;
  font-family: "Playfair", serif;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    width: 50px;
    height: 2px;
    background-color: #433f3e;
    transform: translateX(-50%);
  }

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 20px;
  text-align: center;

  @media (min-width: 768px) {
    flex: 1;
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  padding: 20px;

  @media (min-width: 768px) {
    flex: 1;
  }
`;

const StyledImage = styled(LazyLoadImage)`
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  color: #555;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 900;
  font-size: 1.5rem;

  @media (min-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Content = styled.div`
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
  font-weight: 400;
  text-align: left;

  @media (min-width: 768px) {
    font-size: 1.2rem;
  }

  ul {
    list-style: none;
    padding-left: 20px;
  }

  li {
    position: relative;
    margin-bottom: 10px;

    &::before {
      content: '✦';
      position: absolute;
      left: -20px;
      color: #433f3e;
    }
  }
`;

const AboutUs: React.FC = () => {
  return (
    <AboutSection>
      <SectionHeader>About Us</SectionHeader>
      <Section imageRight={true}>
        <ImageContainer>
          <StyledImage
            src="/images/mission.jpg"
            alt="Our Mission"
            effect="blur"
          />
        </ImageContainer>
        <ContentContainer>
          <Title>Our Mission</Title>
          <Content>
            <p>At Envy, we are dedicated to redefining the role of caps in fashion with creativity at the forefront. Our mission is to:</p>
            <ul>
              <li>Infuse the market with a blend of classic style and inventive designs</li>
              <li>Make headwear a cornerstone of personal style</li>
              <li>Empower individuals to express themselves through unique, high-quality caps</li>
            </ul>
          </Content>
        </ContentContainer>
      </Section>
      <Section imageRight={false}>
        <ImageContainer>
          <StyledImage
            src="/images/innovation.jpg"
            alt="Innovation in Design"
            effect="blur"
          />
        </ImageContainer>
        <ContentContainer>
          <Title>Innovation in Design</Title>
          <Content>
            <p>Each Envy cap is a statement of innovation, crafted to push boundaries and set trends. Our approach includes:</p>
            <ul>
              <li>Unique patterns and designs that stand out</li>
              <li>Collaborations with leading artists and fashion designers</li>
              <li>A range from minimalist to avant-garde styles</li>
            </ul>
          </Content>
        </ContentContainer>
      </Section>
      <Section imageRight={true}>
        <ImageContainer>
          <StyledImage
            src="/images/quality.jpg"
            alt="Commitment to Quality"
            effect="blur"
          />
        </ImageContainer>
        <ContentContainer>
          <Title>Commitment to Quality</Title>
          <Content>
            <p>Quality is not just a promise, it's a guarantee at Envy. Our commitment includes:</p>
            <ul>
              <li>Using only premium, responsibly sourced materials</li>
              <li>Precision construction techniques for durability</li>
              <li>Rigorous quality control to meet stringent standards</li>
            </ul>
          </Content>
        </ContentContainer>
      </Section>
    </AboutSection>
  );
};

export default AboutUs;