import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import axiosInstance from '../axiosInstance';
import { useCart } from '../context/CartContext';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
`;

const Details = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 20px;
`;

const DetailItem = styled.div`
  margin-bottom: 10px;
`;

const DetailLabel = styled.span`
  font-weight: bold;
  color: #555;
`;

const Button = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 12px 24px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #555;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  font-weight: bold;
`;

const SectionTitle = styled.h3`
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 15px;
`;

const CartSummary = styled.div`
  margin-top: 20px;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const TotalPrice = styled.div`
  font-weight: bold;
  text-align: right;
  margin-top: 15px;
  font-size: 1.2em;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;


const ShippingOptionsContainer = styled.div`
  margin-top: 20px;
`;

const ShippingOption = styled.div<{ selected: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid ${props => props.selected ? '#333' : '#ddd'};
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #333;
  }
`;

const TotalBreakdown = styled.div`
  margin-top: 20px;
  border-top: 1px solid #ddd;
  padding-top: 20px;
`;

const TotalItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const GrandTotal = styled(TotalItem)`
  font-weight: bold;
  font-size: 1.2em;
  margin-top: 10px;
  border-top: 1px solid #ddd;
  padding-top: 10px;
`;

interface ShippingOptionType {
  rate: number;
  rate_excluding_vat: number;
  service_level: {
    id: string;
    name: string;
    description: string;
  };
}



interface UserDetails {
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  phone: string;
}

const CheckoutConfirmation: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { state, clearLocalCart } = useCart();
  const [isAddressValid, setIsAddressValid] = useState(true);
  const [shippingOptions, setShippingOptions] = useState<ShippingOptionType[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOptionType | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/details');
        setUserDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('Failed to load user details. Please try again.');
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);


  useEffect(() => {
    const validateAddress = async () => {
      if (userDetails) {
        try {
          const response = await axiosInstance.post('/api/shipping/validate-address', {
            address: userDetails.address,
            city: userDetails.city,
            province: userDetails.province,
            postalCode: userDetails.postal_code,
          });
          setIsAddressValid(response.data.isValid);
        } catch (error) {
          console.error('Error validating address:', error);
          setIsAddressValid(false);
        }
      }
    };

    validateAddress();
  }, [userDetails]);


  useEffect(() => {
    const fetchShippingRates = async () => {
      if (userDetails && isAddressValid) {
        try {
          const response = await axiosInstance.post('/api/shipping/rates', {
            cartItems: state.items,
            deliveryAddress: {
              address: userDetails.address,
              city: userDetails.city,
              province: userDetails.province,
              postalCode: userDetails.postal_code,
            },
          });
          setShippingOptions(response.data.rates);
        } catch (error) {
          console.error('Error fetching shipping rates:', error);
          setError('Failed to fetch shipping options. Please try again.');
        }
      }
    };

    fetchShippingRates();
  }, [userDetails, isAddressValid, state.items]);



  const handleShippingSelect = (option: ShippingOptionType) => {
    setSelectedShipping(option);
  };

  const handleConfirmOrder = async () => {
    if (!userDetails || !selectedShipping) {
      setError('Please select a shipping option before confirming your order.');
      return;
    }

    try {
      const response = await axiosInstance.post('/api/checkout/process', {
        userData: userDetails,
        cartItems: state.items,
        selectedShipping,
      });

      if (response.data.success) {
        clearLocalCart();
        navigate(`/order-confirmation/${response.data.orderId}`);
      } else {
        setError('Checkout failed. Please try again.');
      }
    } catch (error) {
      console.error('Error processing the order:', error);
      setError('An error occurred while processing your order. Please try again.');
    }
  };


  if (loading) {
    return <Container>Loading...</Container>;
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
        <Link to="/checkout">
          <Button>Return to Checkout</Button>
        </Link>
      </Container>
    );
  }

  if (!userDetails) {
    return (
      <Container>
        <ErrorMessage>User details are not available. Please try again.</ErrorMessage>
        <Link to="/checkout">
          <Button>Return to Checkout</Button>
        </Link>
      </Container>
    );
  }

  const totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);


  const calculateSubtotal = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shippingCost = selectedShipping ? selectedShipping.rate : 0;
    return subtotal + shippingCost;
  };


  return (
    <Container>
      <Title>Confirm Your Order</Title>
      {!isAddressValid && (
        <ErrorMessage>
          There might be an issue with your address. Please <Link to="/checkout">edit your details</Link> to ensure accurate shipping.
        </ErrorMessage>
      )}
      <Details>
        <SectionTitle>Shipping Details</SectionTitle>
        <DetailItem>
          <DetailLabel>Name:</DetailLabel> {userDetails.first_name} {userDetails.last_name}
        </DetailItem>
        <DetailItem>
          <DetailLabel>Address:</DetailLabel> {userDetails.address}
        </DetailItem>
        <DetailItem>
          <DetailLabel>City:</DetailLabel> {userDetails.city}
        </DetailItem>
        <DetailItem>
          <DetailLabel>Province:</DetailLabel> {userDetails.province}
        </DetailItem>
        <DetailItem>
          <DetailLabel>Postal Code:</DetailLabel> {userDetails.postal_code}
        </DetailItem>
        <DetailItem>
          <DetailLabel>Phone:</DetailLabel> {userDetails.phone}
        </DetailItem>
        <DetailItem>
          <DetailLabel>Email:</DetailLabel> {userDetails.email}
        </DetailItem>
      </Details>
      <CartSummary>
        <SectionTitle>Order Summary</SectionTitle>
        {state.items.map((item) => (
          <CartItem key={item.id}>
            <span>{item.name} x {item.quantity}</span>
            <span>R {(item.price * item.quantity).toFixed(2)}</span>
          </CartItem>
        ))}
      </CartSummary>
      <ShippingOptionsContainer>
        <SectionTitle>Shipping Options</SectionTitle>
        {shippingOptions.map((option) => (
          <ShippingOption
            key={option.service_level.id}
            selected={selectedShipping?.service_level.id === option.service_level.id}
            onClick={() => handleShippingSelect(option)}
          >
            <span>{option.service_level.name}</span>
            <span>R {option.rate.toFixed(2)}</span>
          </ShippingOption>
        ))}
      </ShippingOptionsContainer>
      <TotalBreakdown>
        <TotalItem>
          <span>Subtotal:</span>
          <span>R {calculateSubtotal().toFixed(2)}</span>
        </TotalItem>
        <TotalItem>
          <span>Shipping:</span>
          <span>R {(selectedShipping ? selectedShipping.rate : 0).toFixed(2)}</span>
        </TotalItem>
        <GrandTotal>
          <span>Total:</span>
          <span>R {calculateTotal().toFixed(2)}</span>
        </GrandTotal>
      </TotalBreakdown>
      <ButtonContainer>
        <Link to="/cart">
          <Button>Back to Cart</Button>
        </Link>
        <div>
          <Button onClick={handleConfirmOrder} disabled={!isAddressValid || !selectedShipping}>
            Confirm Order
          </Button>
          <Link to="/checkout">
            <Button>Edit Details</Button>
          </Link>
        </div>
      </ButtonContainer>
    </Container>
  );
};

export default CheckoutConfirmation;