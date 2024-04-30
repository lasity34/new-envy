// src/components/ProductCard.tsx
import React from 'react';
import styled from 'styled-components';
import { ProductCardProps } from '../types'; // Importing type definitions

const CardContainer = styled.div`
    padding: 16px;
    width: 400px;
    margin: 10px;
    background: #fff;
    border-radius: 8px;
    transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
    &:hover {
        box-shadow: 0 12px 24px rgba(0,0,0,0.2);
        transform: translateY(-5px);
    }
`;


const ProductImage = styled.img`
    width: 320px;  // Set specific width
    height: 220px; // Set specific height to maintain uniformity
    margin-bottom: 10px;
    border-radius: 4px; // Rounds the corners of the image
    object-fit: cover; // Ensures the image fills the frame without distorting
`;

const ProductName = styled.h2`
    font-size: 1.2rem; // Reduced for a slimmer look
    color: #404040; // Dark gray for a professional appearance
    font-weight: 300; // Lighter font weight for slim text
    margin: 2px 0;  // Reduced vertical spacing
`;

const ProductPrice = styled.p`
    font-size: 1.2rem;
    color: #404040; // Same color as the product name for uniformity
    font-weight: 300; // Lighter font weight to match the name's slim appearance
    margin: 0.2em 0;
`;

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <CardContainer>
            <ProductImage src={product.imageUrl} alt={product.name} />
            <ProductName>{product.name}</ProductName>
            <ProductPrice>R {product.price}.00</ProductPrice> 
        </CardContainer>
    );
}

export default ProductCard;
