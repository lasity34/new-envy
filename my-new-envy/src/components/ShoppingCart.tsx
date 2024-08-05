import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { RiDeleteBinLine } from "react-icons/ri";
import { useUser } from "../context/UserContext";
import axiosInstance from '../axiosInstance';

const CartContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  background: #fff;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  font-family: "Crimson Text", serif;

  @media (min-width: 768px) {
    padding: 20px;
    max-width: 85%;
  }
`;

const CartTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 15px;

  @media (min-width: 768px) {
    font-size: 2.5rem;
    font-weight: 300;
    margin-bottom: 20px;
  }
`;


const CartItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 15px;
  border-bottom: 1px solid #eceaea;
  padding: 10px 0;
  position: relative;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
`;


const ItemDetails = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 10px;

  @media (min-width: 768px) {
    width: 40%;
    margin-bottom: 0;
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: auto;
  max-height: 80px;
  object-fit: contain;
  margin-right: 15px;

  @media (min-width: 768px) {
    width: 100px;
    max-height: 100px;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ItemName = styled.p`
  font-size: 1rem;
  color: #333;
  margin: 0 0 5px 0;
`;

const ItemPrice = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 5px 0;
`;

const StockInfo = styled.span`
  font-size: 0.9rem;
  color: #28a745;
`;

const QualityAdContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  @media (min-width: 768px) {
    width: 30%;
    justify-content: flex-start;
  }
`;

const QuantityAndTotalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 10px;

  @media (min-width: 768px) {
    margin-top: 0;
  }
`;

const QuantityAdjuster = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
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

const DeleteIcon = styled(RiDeleteBinLine)`
  cursor: pointer;
  font-size: 1.2rem;
  margin-left: 20px;

   @media (min-width: 768px) {
    font-size: 1.5rem;
  }

`;

const ItemTotal = styled.p`
  font-size: 1.1rem;
  color: #333;
  margin-right: 10px;
 width: 30%;

  @media (min-width: 768px) {
    width: 20%;
  }
`;

const NoticeText = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 20px 0;
  text-align: center;
  width: 90%;
`;

const Total = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid #eceaea;
`;

const TotalPriceText = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
`;

const TotalPrice = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
`;

const CheckoutButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 15px 20px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 20px;
  width: 90%;
  text-transform: uppercase;
`;

const ShoppingCart: React.FC = () => {
  const { state, dispatch, removeFromCart, adjustQuantity, mergeAnonymousCartWithUserCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  const [hasDetails, setHasDetails] = useState(false);

  useEffect(() => {
    if (user) {
      mergeAnonymousCartWithUserCart();
    }
  }, [user, mergeAnonymousCartWithUserCart]);


  const checkUserDetails = async () => {
    try {
      const response = await axiosInstance.get('/api/user/has-details');
      setHasDetails(response.data.hasDetails);
    } catch (error) {
      console.error('Error checking user details:', error);
    }
  };

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
    return <CartContainer>Your cart is empty!</CartContainer>;
  }

  const handleCheckout = () => {
    if (!user) {
      navigate("/login");
    } else if (hasDetails) {
      navigate("/checkout-confirmation");
    } else {
      navigate("/checkout");
    }
  };


  return (
    <CartContainer>
      <CartTitle>Cart</CartTitle>
  
      {state.items.map((item) => (
        <CartItemContainer key={item.id}>
          <ItemDetails>
            <ItemImage src={item.imageUrl} alt={item.name} />
            <ItemInfo>
              <ItemName>{item.name}</ItemName>
              <ItemPrice>R {Number(item.price).toFixed(2)}</ItemPrice>
              <StockInfo>In stock</StockInfo>
            </ItemInfo>
          </ItemDetails>
          <QuantityAndTotalContainer>
            <QualityAdContainer>
              <QuantityAdjuster>
                <Button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</Button>
                <QuantityInput value={item.quantity} readOnly />
                <Button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</Button>
              </QuantityAdjuster>
              <DeleteIcon onClick={() => handleRemove(item.id)} />
            </QualityAdContainer>
            <ItemTotal> R {(Number(item.price) * item.quantity).toFixed(2)}</ItemTotal>
          </QuantityAndTotalContainer>
        </CartItemContainer>
      ))}
      <NoticeText>
        Placing an item in your shopping cart does not reserve that item or price. We only reserve stock for your order once payment is received.
      </NoticeText>
      <Total>
        <TotalPriceText>TOTAL: ({state.items.length} {state.items.length === 1 ? 'Item' : 'Items'})</TotalPriceText>
        <TotalPrice>R {totalPrice.toFixed(2)}</TotalPrice>
      </Total>
      <CheckoutButton onClick={handleCheckout}>
        {user ? "Proceed to Checkout" : "Login to Checkout"}
      </CheckoutButton>
    </CartContainer>
  );
};


export default ShoppingCart;