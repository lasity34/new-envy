import React from 'react';
import { useCart } from '../context/CartContext';
import styled from 'styled-components';


const CartContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  background: #fff;
  width: 85%;
  margin: auto;
`;

const CartTitle = styled.h2`
font-size: 2.5rem;
font-weight: 300;
`

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-bottom: 10px;
  padding: 10px 0;
  border-bottom: solid 1px #eceaea;
`;

const HeaderItem = styled.div`
  display: flex;
  color: #777575;
  font-size: 0.9rem;
  font-family: "Playfair", serif;
  font-weight: 300;
  align-items: center;
  width: 200px; // Adjust if needed
`;

const CartItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;  // Maintains space distribution between elements
  width: 100%;
  margin-bottom: 10px;
 
`;

const ItemDetails = styled.div`
  display: flex;
  align-items: center;
  width: 200px; // Match width of Product header
`;


const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 4px;
  margin-right: 20px;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 120px; // Subtract width of ItemImage from ItemDetails
`;


const ItemName = styled.p`
  font-size: 16px;
  color: #333;
  margin: 0;
`;

const ItemPrice = styled.p`
  font-size: 16px;
  color: #333;
  margin: 0;
`;

const ItemTotal = styled.p`
  font-size: 16px;
  color: #333;
  margin: 0;
  padding: 0 10px;
  width: 200px; // Match width of Total header
`;


const QuantityAdjuster = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  border: 1px solid #5c5c5c;
  padding: 10px 5px;
  width: 110px;
`;

const Button = styled.button`
  padding: 0 10px;
  border: none;
  background-color: white;
  cursor: pointer;
`;

const QuantityInput = styled.input`
  width: 30px;
  text-align: center;
  border: none;
  padding: 5px;
  margin: 0 5px;
`;

const TotalPrice = styled.div`
  text-align: right;
  font-size: 18px;
  margin-top: 20px;
`;

const QualityAdContainer = styled.div`
width: 50%;
display: flex;
justify-content: center;
`

const ShoppingCart: React.FC = () => {
  const { state, dispatch } = useCart();

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity > 0) {
      dispatch({ type: 'ADJUST_QUANTITY', payload: { id, quantity } });
    }
  };

  const totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);

  if (state.items.length === 0) {
    return <div>Your cart is empty!</div>;
  }

  return (
    <CartContainer>
      <CartTitle>Your Cart</CartTitle>
      <HeaderRow>
        <HeaderItem>Product</HeaderItem>
        <HeaderItem>Quantity</HeaderItem>
        <HeaderItem>Total</HeaderItem>
      </HeaderRow>
      {state.items.map(item => (
        <CartItemContainer key={item.id}>
          <ItemDetails>
            <ItemImage src={item.imageUrl} alt={item.name} />
            <ItemInfo>
              <ItemName>{item.name}</ItemName>
              <ItemPrice>R {item.price.toFixed(2)}</ItemPrice>
            </ItemInfo>
          </ItemDetails>
          <QualityAdContainer>

          <QuantityAdjuster>
            <Button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</Button>
            <QuantityInput value={item.quantity} readOnly />
            <Button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</Button>
          </QuantityAdjuster>
          </QualityAdContainer>
          <ItemTotal>R {(item.quantity * item.price).toFixed(2)}</ItemTotal>
        </CartItemContainer>
      ))}
      <TotalPrice>Estimated total R {totalPrice.toFixed(2)}</TotalPrice>
    </CartContainer>
  );
};

export default ShoppingCart;
