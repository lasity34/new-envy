// src/components/ProductCard.tsx
import React from 'react';
import styled from 'styled-components';
import { ProductCardProps } from '../types'; // Importing type definitions

const CardContainer = styled.div`
    padding: 16px;
    width: 200px; // Fixed width for grid display
    margin: 10px;
 
    background: #fff; // Set a white background
    border-radius: 8px; // Optional: rounds the corners of the container
`;

const ProductImage = styled.img`
    width: 160px;  // Set specific width
    height: 110px; // Set specific height to maintain uniformity
    margin-bottom: 5px;
    border-radius: 4px; // Rounds the corners of the image
    object-fit: cover; // Ensures the image fills the frame without distorting
`;

const ProductName = styled.h2`
    font-size: 1rem; // Reduced for a slimmer look
    color: #404040; // Dark gray for a professional appearance
    font-weight: 300; // Lighter font weight for slim text
    margin: 2px 0;  // Reduced vertical spacing
`;

const ProductPrice = styled.p`
    font-size: 1rem;
    color: #404040; // Same color as the product name for uniformity
    font-weight: 300; // Lighter font weight to match the name's slim appearance
`;

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <CardContainer>
            <ProductImage src={product.imageUrl} alt={product.name} />
            <ProductName>{product.name}</ProductName>
            <ProductPrice>R{product.price}.00</ProductPrice> 
        </CardContainer>
    );
}

export default ProductCard;
