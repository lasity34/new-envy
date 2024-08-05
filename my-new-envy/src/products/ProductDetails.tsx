import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import styled from "styled-components";
import { MdCheck } from "react-icons/md";
import { Product, CartItem } from "../types/types";



const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  max-width: 1000px;
  width: 90%;
  margin: 20px auto;
  background: #fff;
  border-radius: 8px;
  font-family: "Playfair", serif;
  color: #5c5c5c;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
    margin: 40px auto;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: center;

  @media (min-width: 768px) {
    flex: 1;
    padding: 20px;
  }
`;

const ProductImage = styled.img`
  width: 60%;
  min-width: 200px;
  max-width: 300px;
  height: auto;
  object-fit: contain;
  border-radius: 8px;

  @media (min-width: 768px) {
    max-width: 500px;
  }
`;

const Details = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 768px) {
    flex: 1;
    padding: 20px;
    align-items: flex-start;
  }
`;


const ProductName = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0.2em 0;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 2.2rem;
    text-align: left;
  }
`;

const ProductPrice = styled.p`
  font-size: 1.2rem;
  margin: 4px 0;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 1.4rem;
    text-align: left;
  }
`;

const ProductDescription = styled.p`
  margin-top: 1em;
  margin-bottom: 1em;
  text-align: center;

  @media (min-width: 768px) {
    text-align: left;
  }
`;

const StockInfo = styled.p`
  font-size: 1.2rem;
  margin-top: 2em;
  text-align: center;

  @media (min-width: 768px) {
    text-align: left;
  }
`;

const QuantityWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  margin-top: 1em;

  @media (min-width: 768px) {
    align-items: flex-start;
  }
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #5c5c5c;
  padding: 5px;
  width: 120px;
`;

const QuantityTitle = styled.p`
  margin-bottom: 10px;
  text-align: center;

  @media (min-width: 768px) {
    text-align: left;
  }
`;

const QuantityButton = styled.button`
  padding: 5px 10px;
  background-color: white;
  cursor: pointer;
  border: none;
  font-size: 1.1rem;
`;

const QuantityInput = styled.input`
  width: 40px;
  text-align: center;
  font-size: 0.9rem;
  border: none;
  outline: none;
  margin: 0 5px;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type="number"] {
    -moz-appearance: textfield;
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
  width: 80%;
  max-width: 300px;

  &:hover {
    background-color: #5c5c5c;
    color: white;
  }
`;

const Tax = styled.p`
  padding-bottom: 1.5em;
  border-bottom: 1px solid #d1c9c7;
  text-align: center;

  @media (min-width: 768px) {
    text-align: left;
  }
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: green;
  font-size: 1rem;
  margin-top: 10px;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;

  &.visible {
    opacity: 1;
  }
`;

const API_URL = process.env.REACT_APP_API_URL;

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/products/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        setError("Error fetching product");
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

 

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (addedToCart) {
      timer = setTimeout(() => setAddedToCart(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [addedToCart]);

  if (!product) {
    return <div>{error ? error : "Loading product..."}</div>;
  }

  const handleAddToCart = async () => {
    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      imageUrl: product.imageUrl,
      stock: product.stock,
    };
  
    await addToCart(item);
    setAddedToCart(true);
    setQuantity(1);
  };


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
        <ProductPrice>R {product.price}</ProductPrice>
        <Tax>Tax included.</Tax>
        <ProductDescription>{product.description}</ProductDescription>
        <QuantityWrapper>
          <QuantityTitle>Qty</QuantityTitle>
          <QuantityContainer>
            <QuantityButton onClick={() => handleQuantityChange(-1)}>
              -
            </QuantityButton>
            <QuantityInput type="number" value={quantity} readOnly />
            <QuantityButton onClick={() => handleQuantityChange(1)}>
              +
            </QuantityButton>
          </QuantityContainer>
        </QuantityWrapper>
        <AddToCartButton onClick={handleAddToCart}>Add to Cart</AddToCartButton>
        <SuccessMessage className={addedToCart ? "visible" : ""}>
          <MdCheck style={{ marginRight: "5px" }} />
          Item has been successfully added to cart
        </SuccessMessage>
        <StockInfo>In stock: {product.stock}</StockInfo>
      </Details>
    </DetailsContainer>
  );

}

export default ProductDetails;
