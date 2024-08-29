import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ProductCardProps } from '../types/types';

const CardContainer = styled(Link)`
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
    height: 100%;
    &:hover {
        box-shadow: 0 12px 24px rgba(0,0,0,0.2);
        transform: translateY(-5px);
    }
`;

const ProductImage = styled.img`
    width: 100%;
    height: 180px;
    object-fit: contain;
    background-color: #f8f8f8;
    padding: 10px;
    box-sizing: border-box;
`;

const ProductInfo = styled.div`
    padding: 16px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
`;

const ProductName = styled.h2`
    font-size: 1.2rem; // Increased from 1rem
    color: #333; // Slightly darker for better readability
    font-weight: 500; // Increased from 300 for more prominence
    margin: 0 0 12px 0; // Increased bottom margin
`;

const ProductPrice = styled.p`
    font-size: 1.1rem; // Increased from 1rem
    color: #666; // Adjusted for contrast
    font-weight: 400; // Slightly bolder
    margin: 0;
`;

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const formatPrice = (price: number | string) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return isNaN(numPrice) ? 'Price not available' : `R ${numPrice.toFixed(2)}`;
    };

    return (
        <CardContainer to={`/products/${product.id}`}>
            <ProductImage src={product.imageUrl} alt={product.name} />
            <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>{formatPrice(product.price)}</ProductPrice>
            </ProductInfo>
        </CardContainer>
    );
}

export default ProductCard;