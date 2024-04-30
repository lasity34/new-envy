import React from 'react';
import { useCart } from '../context/CartContext';
import styled from 'styled-components';

const CartItemContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  background: #f7f7f7;
  border-radius: 8px;
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 4px;
  margin-right: 20px;
`;

const ItemDetails = styled.div`
  flex-grow: 1;
`;

const QuantityAdjuster = styled.div`
  display: flex;
  align-items: center;
`;

const Button = styled.button`
  padding: 5px 10px;
  margin: 0 5px;
  font-size: 16px;
  color: #333;
  background: #e4e4e4;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #d4d4d4;
  }
`;

const QuantityInput = styled.input`
  width: 50px;
  text-align: center;
  font-size: 16px;
`;

const ItemPrice = styled.p`
  font-size: 18px;
  font-weight: 500;
`;

const TotalPrice = styled.div`
  font-size: 24px;
  font-weight: bold;
  text-align: right;
  margin-top: 20px;
`;


const ShoppingCart: React.FC = () => {
  const { state, dispatch } = useCart();

  const handleQuantityChange = (id, quantity) => {
    if (quantity > 0) {
      dispatch({ type: 'ADJUST_QUANTITY', payload: { id, quantity } });
    }
  };

  const totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div>
      <h2>Shopping Cart</h2>
      {state.items.map(item => (
        <CartItemContainer key={item.id}>
          <ItemImage src={item.imageUrl} alt={item.name} />
          <ItemDetails>
            <p>{item.name}</p>
            <QuantityAdjuster>
              <Button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</Button>
              <QuantityInput value={item.quantity} readOnly />
              <Button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</Button>
            </QuantityAdjuster>
            <ItemPrice>R {item.price * item.quantity}.00</ItemPrice>
          </ItemDetails>
        </CartItemContainer>
      ))}
      <TotalPrice>Total: R {totalPrice}.00</TotalPrice>
    </div>
  );
};

export default ShoppingCart;
