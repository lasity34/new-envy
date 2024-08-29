import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ProductCard from './ProductCard';
import { Product } from '../types/types';

const ProductsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 40px; // Increased from 20px to 40px
    padding: 40px; // Increased from 20px to 40px
    max-width: 1400px; // Increased from 1200px to allow for more space
    margin: 0 auto;

    @media (min-width: 576px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 992px) {
        grid-template-columns: repeat(4, 1fr);
    }
`;

const SectionHeader = styled.h2`
    width: 100%;
    text-align: center;
    font-size: 2.5rem;
    color: #433f3e;
    margin: 40px 0;
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