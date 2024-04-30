import React from 'react';
import { useCart } from '../context/CartContext';
import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';

const CartContainer = styled.div`
  padding: 20px;
  background: #fff;
  width: 80%;
  margin: auto;
`;

const HeaderRow = styled.div`
  display: flex;
  font-weight: bold;
  margin-bottom: 10px;
  padding: 10px 0;
`;

const HeaderItem = styled.div`
  flex: 1;
  text-align: center;
`;

const CartItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  border-bottom: 1px solid #eaeaea;
`;

const ItemDetails = styled.div`
  display: flex;
  align-items: center;
  flex: 2;
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
`;

const QuantityAdjuster = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #5c5c5c;
  width: 50%;
  padding: 5px;
  flex: 1; // Ensures consistent positioning
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
      <h2>Your Cart</h2>
      <HeaderRow>
        <HeaderItem style={{ flex: 2 }}>Product</HeaderItem>
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
          <QuantityAdjuster>
            <Button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</Button>
            <QuantityInput value={item.quantity} readOnly />
            <Button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</Button>
          </QuantityAdjuster>
          <ItemTotal>R {(item.quantity * item.price).toFixed(2)}</ItemTotal>
        </CartItemContainer>
      ))}
      <TotalPrice>Estimated total R {totalPrice.toFixed(2)}</TotalPrice>
    </CartContainer>
  );
};

export default ShoppingCart;
