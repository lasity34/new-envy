import React, { useState } from 'react';
import styled from 'styled-components';

// Styled components for the form
const ContactContainer = styled.div`
  padding: 2rem;
 
  min-height: 60vh;  // Ensures the container is decently sized
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  width: 100%;
  padding: 20px;
  background: white;
  border-radius: 8px;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const TextArea = styled.textarea`
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  height: 100px;  // Fixed height for the textarea
`;

const Button = styled.button`
  padding: 10px 20px;
  color: white;
  background-color: #433f3e;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #605a58
  }
`;

const Label = styled.label`
  margin-bottom: 5px;
  color: #666;
`;

// ContactUs component
const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Here you would typically handle the form submission, e.g., sending data to a server
    alert('Message sent successfully!');
  };

  return (
    <ContactContainer>
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="name">Name *</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <Label htmlFor="email">Email *</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Label htmlFor="message">Message *</Label>
        <TextArea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
        />
        <Button type="submit">Send Message</Button>
      </Form>
    </ContactContainer>
  );
};

export default ContactUs;
