import React from 'react';
import { useCart } from '../context/CartContext';
import styled from 'styled-components';

const CartItemContainer = styled.div`
  // Styles for your cart items
`;

const ShoppingCart: React.FC = () => {
  const { state } = useCart();

  return (
    <div>
      <h2>Shopping Cart</h2>
      {state.items.map(item => (
        <CartItemContainer key={item.id}>
          <p>{item.name} - Qty: {item.quantity}</p>
          <p>Price: R{item.price * item.quantity}.00</p>
        </CartItemContainer>
      ))}
    </div>
  );
};

export default ShoppingCart;
