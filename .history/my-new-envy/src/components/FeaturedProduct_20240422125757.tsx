// Assuming you are in FeaturedProducts.tsx or a similar file
import React from 'react';
import styled from 'styled-components';
import ProductCard from './ProductCard';
import { products } from '../data';  // This should correctly import the array of products
import { Product } from '../types';  // Importing the Product type definition

const ProductsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px; // Provides space between cards
    padding: 20px;
`;

const FeaturedProducts: React.FC = () => {
    return (
        <ProductsContainer>
            {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </ProductsContainer>
    );
};

export default FeaturedProducts;
