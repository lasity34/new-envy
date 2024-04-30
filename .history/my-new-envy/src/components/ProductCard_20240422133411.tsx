// src/components/ProductCard.tsx
import React from 'react';
import styled from 'styled-components';
import { ProductCardProps } from '../types'; // Importing type definitions

const CardContainer = styled.div`
    padding: 16px;
    text-align: center;
    width: 200px; // Fixed width for grid display
    margin: 10px;
    box-shadow: 0px 0px 5px #ccc; // Optional: adds shadow for better visibility
`;

const ProductImage = styled.img`
    width: 160px;  // Set specific width
    height: 160px; // Set specific height to maintain uniformity
    object-fit: cover; // Ensures the image covers the set width and height without distortion

    margin-bottom: 10px;
    border-radius: 4px; // Optional: rounds the corners of the image
`;

const ProductName = styled.h2`
    font-size: 1.2rem;
    color: #333;
    margin: 10px 0;  // Adds vertical spacing
`;

const ProductPrice = styled.p`
    font-size: 1rem;
    color: #666;
    font-weight: bold;  // Emphasizes the price
`;

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <CardContainer>
            <ProductImage src={product.imageUrl} alt={product.name} />
            <ProductName>{product.name}</ProductName>
            <ProductPrice>{product.price}</ProductPrice>
        </CardContainer>
    );
}

export default ProductCard;
