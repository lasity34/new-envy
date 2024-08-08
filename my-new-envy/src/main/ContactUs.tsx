import React, { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const ContactContainer = styled.div`
  padding: 2rem;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  width: 100%;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #433f3e;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 4px;
  border: 1px solid #ccc;
  height: 150px;
  font-size: 16px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #433f3e;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  color: white;
  background-color: #433f3e;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #605a58;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Label = styled.label`
  margin-bottom: 8px;
  color: #433f3e;
  font-weight: bold;
`;

const SectionHeader = styled.h2`
  width: 100%;
  text-align: center;
  font-size: 2.5rem;
  color: #433f3e;
  margin: 40px 0;
  font-family: "Playfair", serif;
`;

const ErrorMessage = styled.p`
  color: #ff0000;
  font-size: 14px;
  margin-top: -15px;
  margin-bottom: 15px;
`;

const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
`;

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  message: yup.string().required("Message is required"),
});

const ContactUs: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async (data: any) => {
    // Here you would typically send the form data to your backend
    console.log("Form Data:", data);
    // Simulating an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    reset();
  };

  return (
    <ContactContainer>
      <SectionHeader>Contact Us</SectionHeader>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {isSubmitted && (
          <SuccessMessage>Thank you for your message. We'll get back to you soon!</SuccessMessage>
        )}
        <Label htmlFor="name">Name *</Label>
        <Input
          type="text"
          id="name"
          {...register("name")}
        />
        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}

        <Label htmlFor="email">Email *</Label>
        <Input
          type="email"
          id="email"
          {...register("email")}
        />
        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

        <Label htmlFor="message">Message *</Label>
        <TextArea
          id="message"
          {...register("message")}
        />
        {errors.message && <ErrorMessage>{errors.message.message}</ErrorMessage>}

        <Button type="submit">Send Message</Button>
      </Form>
    </ContactContainer>
  );
};

export default ContactUs;