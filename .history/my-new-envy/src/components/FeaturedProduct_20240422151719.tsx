import React from 'react';
import styled from 'styled-components';
import ProductCard from './ProductCard';
import { products } from '../data';  // Ensure this correctly imports the array of products
import { Product } from '../types';  // Ensure Product type is defined and imported

const ProductsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px; // Provides space between cards
    padding: 20px;
`;

const SectionHeader = styled.h2`
  width: 100%;
  text-align: center;
  font-size: 2.5rem; // Large font size for emphasis
  color: #003366; // A rich blue that might match your theme
  margin: 40px 0; // Adds vertical space around the header
  padding-bottom: 10px;
  border-bottom: 3px solid #f1c40f; // A subtle underline that matches your theme
  font-family: 'Montserrat', sans-serif; // Assuming Montserrat is imported and used site-wide
`;

const FeaturedProducts: React.FC = () => {
    return (
        <>
            <SectionHeader>New Arrivals</SectionHeader>
            <ProductsContainer>
                {products.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </ProductsContainer>
        </>
    );
};

export default FeaturedProducts;
