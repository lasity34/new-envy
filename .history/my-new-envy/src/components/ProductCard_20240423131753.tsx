import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom'; // Ensure this is imported
import { ProductCardProps } from '../types'; // Importing type definitions

// Styled Components
const CardContainer = styled(Link)` // Change from div to Link
    display: block;
    text-decoration: none; // Remove underline from all text
    color: inherit; // Ensure text colors inherit rather than default link color
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
    width: 100%;  // Changed to 100% to fill card width
    height: 210px; // Set specific height to maintain uniformity
    margin-bottom: 10px;
    border-radius: 4px;
    object-fit: cover; // Ensures the image fills the frame without distorting
`;

const ProductName = styled.h2`
    font-size: 1.2rem;
    color: #404040;
    font-weight: 300;
    margin: 2px 0;
`;

const ProductPrice = styled.p`
    font-size: 1.2rem;
    color: #404040;
    font-weight: 300;
    margin: 0.2em 0;
`;

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <CardContainer to={`/products/${product.id}`}>
            <ProductImage src={product.imageUrl} alt={product.name} />
            <ProductName>{product.name}</ProductName>
            <ProductPrice>R {product.price}.00</ProductPrice>
        </CardContainer>
    );
}

export default ProductCard;
