import React from 'react';
import styled from 'styled-components';

const AboutSection = styled.section`
  padding: 4rem 0;
  background: #f9f9f9;
  text-align: center;
`;

const Section = styled.div`
  margin-bottom: 3rem;
`;

const Title = styled.h2`
  color: #003366; // Deep blue, consistent with your theme
  margin-bottom: 1rem;
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
      <Section>
        <Title>Our Mission</Title>
        <Content>
          At Envy, we are dedicated to redefining the role of caps in fashion with creativity at the forefront. 
          Born from a desire to infuse the market with a blend of classic style and inventive designs, Envy aims 
          to make headwear a cornerstone of personal style.
        </Content>
      </Section>
      <Section>
        <Title>Innovation in Design</Title>
        <Content>
          Each Envy cap is a statement of innovation—crafted with unique patterns and the finest collaborations 
          in the art and fashion industries. Our signature collections, from minimalist to avant-garde, are 
          designed to push boundaries and set trends.
        </Content>
      </Section>
      <Section>
        <Title>Commitment to Quality</Title>
        <Content>
          Quality is not just a promise, it's a guarantee. We use only premium materials, sourced responsibly, 
          and constructed with precision, ensuring every cap not only looks fantastic but lasts. Our rigorous 
          quality control process ensures each product meets stringent standards before reaching your hands.
        </Content>
      </Section>
    </AboutSection>
  );
};

export default AboutUs;
