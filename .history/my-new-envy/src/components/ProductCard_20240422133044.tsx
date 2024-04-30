// src/components/ProductCard.tsx
import React from 'react';
import styled from 'styled-components';
import { ProductCardProps } from '../types'; // Importing type definitions

const CardContainer = styled.div`
   
    padding: 16px;
    text-align: center;
    width: 200px; // Fixed width for grid display
    margin: 10px;
`;

const ProductImage = styled.img`
    width: 100%;
    height: auto;

    margin-bottom: 10px;
`;

const ProductName = styled.h2`
    font-size: 1.2rem;
    color: #333;
`;

const ProductDescription = styled.p`
    font-size: 0.9rem;
    color: #666;
`;



const ProductCard: React.FC<ProductCardProps> = ({ product}) => {
    return (
        <CardContainer>
            <ProductImage src={product.imageUrl} alt={product.name} />
            <ProductName>{product.name}</ProductName>
            <ProductDescription>{product.price}</ProductDescription>
           
        </CardContainer>
    )
}

export default ProductCard;
