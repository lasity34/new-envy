import React from 'react';
import styled from 'styled-components';

const AboutSection = styled.section`
  padding: 4rem 0;
  background: #f9f9f9;
  text-align: center;
`;

const Title = styled.h2`
  color: #003366; // Deep blue, consistent with your theme
  margin-bottom: 2rem;
`;

const Content = styled.p`
  color: #555; // Dark grey for readability
  font-size: 1.2rem;
  margin: 0 auto;
  width: 80%; // Keeps the text well-contained in the center
  line-height: 1.6;
`;

const AboutUs: React.FC = () => {
  return (
    <AboutSection>
      <Title>About Us</Title>
      <Content>
        Welcome to Cap Store, your number one source for all things caps. Founded in [Year],
        we have grown from a small startup in [Location] to a leader in the industry. We are
        dedicated to providing you with the best quality caps, focusing on style, comfort, and customer satisfaction.
      </Content>
    </AboutSection>
  );
};

export default AboutUs;
