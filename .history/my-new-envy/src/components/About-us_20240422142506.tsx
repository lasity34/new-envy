import React from 'react';
import styled from 'styled-components';

const AboutSection = styled.section`
  padding: 4rem 0;
  background: #f9f9f9;
`;

const Section = styled.div<{ imageRight: boolean }>`
  display: flex;
  flex-direction: ${({ imageRight }) => (imageRight ? 'row-reverse' : 'row')};
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
  padding: 0 5%;

  &:nth-child(odd) {
    background-color: #fff; // Light background for contrast
  }

  &:nth-child(even) {
    background-color: #f0f0f0; // Alternate background for differentiation
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  padding: 20px;
  text-align: center;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 20px;
`;

const Image = styled.img`
  width: 80%;
  max-width: 400px; // Ensures the image is not too large
  height: auto;
  border-radius: 8px; // Optional: adds rounded corners to your images
`;

const Title = styled.h2`
  color: #003366;
  text-align: center;
  margin-bottom: 20px;
`;

const Content = styled.p`
  font-size: 1.2rem;
  color: #555;
  line-height: 1.6;
`;


const AboutUs: React.FC = () => {
    return (
      <AboutSection>
        <Section imageRight={true}>
          <ImageContainer>
            <Image src="/images/mission.jpg" alt="Our Mission"/>
          </ImageContainer>
          <ContentContainer>
            <Title>Our Mission</Title>
            <Content>
              At Envy, we are dedicated to redefining the role of caps in fashion with creativity at the forefront. Born from a desire to infuse the market with a blend of classic style and inventive designs, Envy aims to make headwear a cornerstone of personal style.
            </Content>
          </ContentContainer>
        </Section>
        <Section imageRight={false}>
          <ImageContainer>
            <Image src="/images/innovation.jpg" alt="Innovation in Design"/>
          </ImageContainer>
          <ContentContainer>
            <Title>Innovation in Design</Title>
            <Content>
              Each Envy cap is a statement of innovation—crafted with unique patterns and the finest collaborations in the art and fashion industries. Our signature collections, from minimalist to avant-garde, are designed to push boundaries and set trends.
            </Content>
          </ContentContainer>
        </Section>
        <Section imageRight={true}>
          <ImageContainer>
            <Image src="/images/quality.jpg" alt="Commitment to Quality"/>
          </ImageContainer>
          <ContentContainer>
            <Title>Commitment to Quality</Title>
            <Content>
              Quality is not just a promise, it's a guarantee. We use only premium materials, sourced responsibly, and constructed with precision, ensuring every cap not only looks fantastic but lasts. Our rigorous quality control process ensures each product meets stringent standards before reaching your hands.
            </Content>
          </ContentContainer>
        </Section>
      </AboutSection>
    );
  };
  
  export default AboutUs;
  
