// src/components/ProductDetails.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { products } from '../data'; // Make sure you have an exportable products array in data.js
import { Product as ProductType } from '../types'; // Assuming you have a type definition for Product

const DetailsContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: auto;
  background: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  border-radius: 8px;
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
`;

const ProductName = styled.h1`
  font-size: 2rem;
  color: #333;
`;

const ProductPrice = styled.p`
  font-size: 1.5rem;
  color: #666;
  margin: 10px 0;
`;

const ProductDescription = styled.p`
  font-size: 1.2rem;
  color: #666;
`;

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract the product ID from the URL
  const product = products.find(p => p.id === id); // Find the product that matches the ID

  if (!product) {
    return <div>Product not found!</div>; // Handle case where product does not exist
  }

  return (
    <DetailsContainer>
      <ProductImage src={product.imageUrl} alt={product.name} />
      <ProductName>{product.name}</ProductName>
      <ProductPrice>R {product.price}</ProductPrice>
    </DetailsContainer>
  );
}

export default ProductDetails;
