import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { RiDeleteBinLine } from "react-icons/ri";
import { useUser } from "../context/UserContext"; // Add this import

const CartContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  background: #fff;
  width: 85%;
  margin: auto;
  font-family: "Crimson Text", serif;
`;

const CartTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 300;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-bottom: 10px;
  padding: 10px 0;
  border-bottom: solid 1px #eceaea;
  width: 110%;
`;

const HeaderItem = styled.div`
  display: flex;
  color: #777575;
  font-size: 1rem;
  font-family: "Playfair", serif;
  font-weight: 300;
  align-items: center;
  width: 200px;
`;

const CartItemContainer = styled.div`
  display: flex;
  justify-content: space-between; // Maintains space distribution between elements
  width: 110%;
  margin: 0.9em 0;
  border-bottom: solid 1px #eceaea;
  padding-bottom: 1em;
`;

const ItemDetails = styled.div`
  display: flex;
  width: 300px; // Match width of Product header
`;

const ItemImage = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 4px;
  margin-right: 20px;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 120px; // Subtract width of ItemImage from ItemDetails
`;

const ItemName = styled.p`
  font-size: 1.2rem;
  color: #333;
  margin: 0;
  margin-bottom: 10px;
`;

const ItemPrice = styled.p`
  font-size: 1.3rem;
  color:  #6c6868;
  font-weight: 300;
  margin: 0;
`;

const ItemTotal = styled.p`
  font-size: 1.2rem;
  color: #333;
  margin: 0;
  padding: 0 10px;
  width: 200px; // Match width of Total header
`;

const QuantityAdjuster = styled.div`
  display: flex;
  height: 30px;
  justify-content: left;
  border: 1px solid #5c5c5c;
  padding: 5px;
  width: 110px;
`;

const Button = styled.button`
  padding: 0 10px;
  border: none;
  background-color: white;
  font-size: 1.2rem;
  cursor: pointer;
`;

const QuantityInput = styled.input`
  width: 30px;
  text-align: center;
  border: none;
  padding: 5px;
  margin: 0 5px;
`;

const Total = styled.div`
  display: flex;
  align-items: center;
  justify-content: right;
  width: 98%;
`;

const TotalPriceText = styled.div`
  font-size: 1.3rem;
  margin-right: 1.6em;
`;

const TotalPrice = styled.div`
  text-align: right;
  font-size: 1.2em;
  margin: 15px 0;
  color:  #6d6a6a;
`;

const QualityAdContainer = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
`;

const CheckoutButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1.2rem;
  margin-top: 20px;
`;

const ShoppingCart: React.FC = () => {
  const { state, dispatch, removeFromCart, adjustQuantity, mergeAnonymousCartWithUserCart } = useCart();
  const { user } = useUser(); // Add this line
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      mergeAnonymousCartWithUserCart();
    }
  }, [user, mergeAnonymousCartWithUserCart]);

  const handleRemove = async (id: string) => {
    if (user) {
      await removeFromCart(id);
    } else {
      dispatch({ type: "REMOVE_ITEM", payload: { id } });
    }
  };

  const handleQuantityChange = async (id: string, quantity: number) => {
    if (quantity > 0) {
      if (user) {
        await adjustQuantity(id, quantity);
      } else {
        dispatch({ type: "ADJUST_QUANTITY", payload: { id, quantity } });
      }
    }
  };

  const totalPrice = state.items.reduce(
    (total, item) => total + (Number(item.price) || 0) * item.quantity,
    0
  );

  if (state.items.length === 0) {
    return <div>Your cart is empty!</div>;
  }

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <CartContainer>
      <CartTitle>Your Cart</CartTitle>
      <HeaderRow>
        <HeaderItem>Product</HeaderItem>
        <HeaderItem style={{ marginLeft: "150px" }}>Quantity</HeaderItem>
        <HeaderItem>Total</HeaderItem>
      </HeaderRow>
      {state.items.map((item) => (
        <CartItemContainer key={item.id}>
          <ItemDetails>
            <ItemImage src={item.imageUrl} alt={item.name} />
            <ItemInfo>
              <ItemName>{item.name}</ItemName>
              <ItemPrice>R {Number(item.price).toFixed(2)}</ItemPrice>
            </ItemInfo>
          </ItemDetails>
          <QualityAdContainer>
            <QuantityAdjuster>
              <Button
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
              >
                -
              </Button>
              <QuantityInput value={item.quantity} readOnly />
              <Button
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
              >
                +
              </Button>
            </QuantityAdjuster>
            <RiDeleteBinLine
              style={{ cursor: "pointer", marginLeft: "25px", marginTop: "15px" }}
              onClick={() => handleRemove(item.id)}
            />
          </QualityAdContainer>
          <ItemTotal>R {(Number(item.price) * item.quantity).toFixed(2)}</ItemTotal>
        </CartItemContainer>
      ))}
      <Total>
        <TotalPriceText>Total:</TotalPriceText>
        <TotalPrice>R {totalPrice.toFixed(2)}</TotalPrice>
      </Total>
      <CheckoutButton onClick={handleCheckout}>Proceed to Checkout</CheckoutButton>
    </CartContainer>
  );
};

export default ShoppingCart;
