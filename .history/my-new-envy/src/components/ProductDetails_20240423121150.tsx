import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { products } from '../data'; // Ensure your data is properly structured

const DetailsContainer = styled.div`
  display: flex;
  padding: 20px;
  max-width: 1200px;
  margin: 40px auto;
  background: #fff;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
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
  color: #333;
  margin: 0.2em 0;
`;

const ProductPrice = styled.p`
  font-size: 1.4rem;
  color: #333;
  margin: 10px 0 20px;
`;

const ProductDescription = styled.p`

`

const StockInfo = styled.p`
  font-size: 1.2rem;
  margin-top: 5px;
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const QuantityButton = styled.button`
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
  cursor: pointer;

  &:hover {
    background-color: #e2e2e2;
  }
`;

const QuantityInput = styled.input`
  width: 50px;
  text-align: center;
  margin: 0 10px;
  font-size: 1.2rem;
`;

const AddToCartButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  font-size: 1.2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;

const Tax = styled.p`
margin: 0.2em;
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
        <Tax>tax included</Tax>
        <ProductDescription>{product.description}</ProductDescription>
        <StockInfo>In stock: {product.stock}</StockInfo>
        <QuantityContainer>
          <QuantityButton onClick={() => handleQuantityChange(-1)}>-</QuantityButton>
          <QuantityInput type="number" value={quantity} readOnly />
          <QuantityButton onClick={() => handleQuantityChange(1)}>+</QuantityButton>
        </QuantityContainer>
        <AddToCartButton>Add to Cart</AddToCartButton>
      </Details>
    </DetailsContainer>
  );
}

export default ProductDetails;
