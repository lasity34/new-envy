// src/components/ProductCard.tsx
import React from 'react';
import styled from 'styled-components';
import { ProductCardProps } from '../types'; // Importing type definitions

const CardContainer = styled.div`
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    text-align: center;
    width: 200px; // Fixed width for grid display
    margin: 10px;
`;

const ProductImage = styled.img`
    width: 100%;
    height: auto;
    border-bottom: 1px solid #eee;
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

const ViewMoreButton = styled.a`
    display: inline-block;
    padding: 8px 12px;
    background-color: #0056b3;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    margin-top: 8px;

    &:hover {
        background-color: #004494;
    }
`;

const ProductCard: React.FC<ProductCardProps> = ({ product}) => {
    return (
        <CardContainer>
            <ProductImage src={product.imageUrl} alt={product.name} />
            <ProductName>{product.name}</ProductName>
            <ProductDescription>{product.description}</ProductDescription>
            <ViewMoreButton href="#">Add to cart</ViewMoreButton>
        </CardContainer>
    )
}

export default ProductCard;
