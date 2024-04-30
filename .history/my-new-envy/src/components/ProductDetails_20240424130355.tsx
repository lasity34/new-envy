import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';  // Make sure the path matches where your context is
import styled from 'styled-components';
import { products } from '../data';

const DetailsContainer = styled.div`
  display: flex;
  padding: 20px;
  max-width: 1200px;
  width: 90%;
  margin: 40px auto;
  background: #fff;
  border-radius: 8px;
  font-family: "Playfair", serif;
 color: #5c5c5c;
`;

const ImageContainer = styled.div`
  flex: 2;
  padding: 20px;
`;

const ProductImage = styled.img`
  width: 100%;
  max-width: 500px; // Adjust based on your needs
  height: auto;
  object-fit: cover;
  border-radius: 8px;
`;

const Details = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;

`;

const ProductName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0.2em 0;
`;

const ProductPrice = styled.p`
  font-size: 1.4rem;
  margin: 4px 0;
`;

const ProductDescription = styled.p`

`

const StockInfo = styled.p`
  font-size: 1.2rem;
  margin-top: 2em;
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  margin-bottom: 30px;
  border: 1px solid  #5c5c5c; // Add a subtle border around the entire container
  padding: 5px; // Add some padding inside the container
  width: 30%;
`;

const QuantityTitle = styled.p`
margin-bottom: 0;
`

const QuantityButton = styled.button`
  padding: 5px;
  background-color: white;
  cursor: pointer;
  border: none; // Remove border from buttons
  font-size: 1.1rem;
`;

const QuantityInput = styled.input`
  width: 50px;
  text-align: center;
  font-size: 0.9rem;
  border: none; // Ensure there is no border around the input
  outline: none; // Removing the outline can affect accessibility, consider adding a custom focus style

  /* Chrome, Safari, Edge, Opera */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none; // Remove default controls
    margin: 0; // Remove space reserved for controls
  }

  /* Firefox */
  &[type='number'] {
    -moz-appearance: textfield; // Remove default controls
  }
`;


const AddToCartButton = styled.button`
  padding: 10px 20px;
  background-color: white;
  color: #5c5c5c;
  font-size: 1rem;
  border: 1px solid #333;
  border-radius: 22px;
  cursor: pointer;
  margin-top: 20px;
  width: 75%;

  &:hover {
    background-color:  #5c5c5c;
    color: white;
  }
`;

const Tax = styled.p`
padding-bottom: 1.5em;
border-bottom: 1px solid  #d1c9c7 ;
`

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id);

  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <div>Product not found!</div>;
  }

  const handleQuantityChange = (change: number) => {
    let newQuantity = quantity + change;
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > product.stock) newQuantity = product.stock;
    setQuantity(newQuantity);
  };

  return (
    <DetailsContainer>
      <ImageContainer>
        <ProductImage src={product.imageUrl} alt={product.name} />
      </ImageContainer>
      <Details>
        <ProductName>{product.name}</ProductName>
        <ProductPrice>R {product.price}.00 </ProductPrice>
        <Tax>Tax included.</Tax>
        <ProductDescription>{product.description}</ProductDescription>
        <QuantityTitle>Qty</QuantityTitle>
        <QuantityContainer>
          <QuantityButton onClick={() => handleQuantityChange(-1)}>-</QuantityButton>
          <QuantityInput type="number" value={quantity} readOnly />
          <QuantityButton onClick={() => handleQuantityChange(1)}>+</QuantityButton>
        </QuantityContainer>
        <AddToCartButton>Add to Cart</AddToCartButton>
        <StockInfo>In stock: {product.stock}</StockInfo>
      </Details>
    </DetailsContainer>
  );
}

export default ProductDetails;
