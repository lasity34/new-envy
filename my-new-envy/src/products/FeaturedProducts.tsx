import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ProductCard from './ProductCard';
import { Product } from '../types/types';  // Ensure Product type is defined and imported

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
  color: #433f3e; // A rich blue that might match your theme
  margin: 40px 0; // Adds vertical space around the header
  padding-bottom: 10px;
  
  font-family: "Playfair", serif;
`;
const API_URL = process.env.REACT_APP_API_URL;

const FeaturedProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/products`);
                setProducts(response.data);
            } catch (error) {
                setError('Error fetching products');
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <>
            <SectionHeader>New Arrivals!!</SectionHeader>
            {error ? (
                <p>{error}</p>
            ) : (
                <ProductsContainer>
                    {products.map((product: Product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </ProductsContainer>
            )}
        </>
    );
};

export default FeaturedProducts;
