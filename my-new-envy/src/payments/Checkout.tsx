import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import axiosInstance from "../axiosInstance";
import { AxiosError } from "axios";
import styled from "styled-components";

const CheckoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  background: #fff;
  width: 85%;
  max-width: 800px;
  margin: auto;
  font-family: "Crimson Text", serif;
`;

const CheckoutTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 300;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 300;
  margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  font-size: 1.2rem;
  width: 100%;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #333;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  margin-top: 20px;
  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-bottom: 10px;
`;

const ShippingOptionsContainer = styled.div`
  margin-bottom: 20px;
`;

const ShippingOption = styled.div<{ selected: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  padding: 15px;
  border: 2px solid ${(props) => (props.selected ? "#333" : "#e0e0e0")};
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #333;
    background-color: ${(props) =>
      props.selected ? "#f0f0f0" : "transparent"};
  }
`;

const ShippingName = styled.span`
  font-weight: bold;
  grid-column: 1;
`;

const ShippingEstimate = styled.span`
  color: #666;
  font-size: 0.9em;
  grid-column: 2;
  text-align: center;
`;

const ShippingPrice = styled.span`
  font-weight: bold;
  color: #4a4a4a;
  grid-column: 3;
  text-align: right;
`;

const PaymentOption = styled.div<{ selected: boolean }>`
  padding: 10px;
  border: 1px solid ${(props) => (props.selected ? "#333" : "#ccc")};
  margin-bottom: 10px;
  cursor: pointer;
`;

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

interface ShippingOptionType {
  rate: number;
  rate_excluding_vat: number;
  service_level: {
    id: string;
    name: string;
    description: string;
  };
  extras: Array<{
    id: number;
    name: string;
    price: number;
  }>;
}

const Checkout: React.FC = () => {
  const { state, clearLocalCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    phone: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<ShippingOptionType[]>(
    []
  );
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOptionType | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get("/api/auth/details");
        const userDetails = response.data;
        setUserData((prevData) => ({
          ...prevData,
          firstName: userDetails.first_name,
          lastName: userDetails.last_name,
          email: userDetails.email,
          address: userDetails.address,
          city: userDetails.city,
          province: userDetails.province,
          postalCode: userDetails.postal_code,
          phone: userDetails.phone,
        }));
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Failed to load user details. Please try again.");
      }
    };

    if (user) {
      fetchUserDetails();
    } else {
      const savedUserData = localStorage.getItem("userData");
      if (savedUserData) {
        setUserData(JSON.parse(savedUserData));
      }
    }
  }, [user]);

 

  const fetchShippingRates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post<{
        rates: ShippingOptionType[];
      }>("/api/shipping/rates", {
        cartItems: state.items,
        deliveryAddress: {
          address: userData.address,
          city: userData.city,
          province: userData.province,
          postalCode: userData.postalCode,
        },
      });
      console.log("Shipping rates response:", response.data);
      setShippingOptions(response.data.rates);
    } catch (error) {
      console.error("Error fetching shipping rates:", error);
      if (error instanceof AxiosError && error.response) {
        setError(
          error.response.data.error ||
            "Failed to fetch shipping rates. Please check your address details and try again."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setShippingOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, [userData.address, userData.city, userData.province, userData.postalCode, state.items]);

  useEffect(() => {
    if (
      userData.address &&
      userData.city &&
      userData.province &&
      userData.postalCode
    ) {
      fetchShippingRates();
    }
  }, [userData.address, userData.city, userData.province, userData.postalCode, fetchShippingRates]);

  const getEstimatedDeliveryTime = (serviceLevelName: string): string => {
    const lowerCaseName = serviceLevelName.toLowerCase();
    if (
      lowerCaseName.includes("sameday") ||
      lowerCaseName.includes("same day")
    ) {
      return "Estimated Delivery: Today";
    } else if (lowerCaseName.includes("overnight")) {
      return "Estimated Delivery: Tomorrow";
    } else if (lowerCaseName.includes("economy")) {
      return "Estimated Delivery: 2-5 business days";
    } else {
      return "Estimated delivery time varies";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    setUserData((prev) => ({ ...prev, cardNumber: value }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    const formattedValue =
      value.length > 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;
    setUserData((prev) => ({ ...prev, expiry: formattedValue }));
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setUserData((prev) => ({ ...prev, cvc: value }));
  };

  const handleShippingSelect = (option: ShippingOptionType) => {
    setSelectedShipping(option);
  };

  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
  
    if (!user) {
      setError("Please log in to complete your order.");
      return;
    }
  
    if (!selectedShipping) {
      setError("Please select a shipping option.");
      return;
    }
  
    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }
  
    // Check if all required fields are filled
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'province', 'postalCode', 'phone'];
    const missingFields = requiredFields.filter(field => !userData[field as keyof UserData]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Save user details
      await axiosInstance.post("/api/auth/details", {
        first_name: userData.firstName,
        last_name: userData.lastName,
        address: userData.address,
        city: userData.city,
        province: userData.province,
        postal_code: userData.postalCode,
        phone: userData.phone,
        email: userData.email,
      });
  
      // Process checkout
      const response = await axiosInstance.post("/api/checkout/process", {
        userData: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: userData.email,
          address: userData.address,
          city: userData.city,
          province: userData.province,
          postal_code: userData.postalCode,
          phone: userData.phone,
        },
        cartItems: state.items,
        selectedShipping,
        paymentMethod,
      });
  
      if (response.data.success) {
        localStorage.setItem("userData", JSON.stringify(userData));
        clearLocalCart();
  
        if (paymentMethod === "payflex") {
          // Redirect to PayFlex payment page
          window.location.href = response.data.paymentUrl;
        } else {
          navigate(`/order-confirmation/${response.data.orderId}`, {
            state: { fromCheckout: true },
          });
        }
      } else {
        setError("Checkout failed. Please try again.");
        console.error("Checkout failed");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error details:", error.response?.data);
        if (error.response?.status === 401) {
          setError("Please log in to complete your order.");
        } else {
          setError(
            `Error processing the order: ${
              error.response?.data?.message || error.message
            }`
          );
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Error processing the order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <CheckoutContainer>
      <CheckoutTitle>Checkout</CheckoutTitle>
      {!user && (
        <ErrorMessage>
          Please <Link to="/login">log in</Link> to complete your order.
        </ErrorMessage>
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>Contact</SectionTitle>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </Section>
        <Section>
          <SectionTitle>Delivery</SectionTitle>
          <Input
            type="text"
            name="firstName"
            placeholder="First name"
            value={userData.firstName}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={userData.lastName}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="address"
            placeholder="Address"
            value={userData.address}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="city"
            placeholder="City"
            value={userData.city}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="province"
            placeholder="Province"
            value={userData.province}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="postalCode"
            placeholder="Postal code"
            value={userData.postalCode}
            onChange={handleChange}
            required
          />
          <Input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={userData.phone}
            onChange={handleChange}
            required
          />
        </Section>
        <Section>
          <SectionTitle>Shipping Options</SectionTitle>
          {isLoading ? (
            <p>Loading shipping options...</p>
          ) : shippingOptions.length > 0 ? (
            <ShippingOptionsContainer>
              {shippingOptions.map((option) => (
                <ShippingOption
                  key={option.service_level.id}
                  selected={
                    selectedShipping?.service_level.id ===
                    option.service_level.id
                  }
                  onClick={() => handleShippingSelect(option)}
                >
                  <ShippingName>{option.service_level.name}</ShippingName>
                  <ShippingEstimate>
                    {getEstimatedDeliveryTime(option.service_level.name)}
                  </ShippingEstimate>
                  <ShippingPrice>R {option.rate.toFixed(2)}</ShippingPrice>
                </ShippingOption>
              ))}
            </ShippingOptionsContainer>
          ) : (
            <p>
              No shipping options available. Please check your address details
              and ensure all fields are filled.
            </p>
          )}
        </Section>
        <Section>
          <SectionTitle>Payment Method</SectionTitle>
          <PaymentOption
            selected={paymentMethod === "payflex"}
            onClick={() => handlePaymentMethodSelect("payflex")}
          >
            PayFlex
          </PaymentOption>
          <PaymentOption
            selected={paymentMethod === "credit_card"}
            onClick={() => handlePaymentMethodSelect("credit_card")}
          >
            Credit Card
          </PaymentOption>
        </Section>
        {paymentMethod === "credit_card" && (
          <Section>
            <SectionTitle>Credit Card Details</SectionTitle>
            <Input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              value={userData.cardNumber}
              onChange={handleCardNumberChange}
              required
            />
            <Input
              type="text"
              name="expiry"
              placeholder="Expiry Date (MM/YY)"
              value={userData.expiry}
              onChange={handleExpiryChange}
              required
            />
            <Input
              type="text"
              name="cvc"
              placeholder="CVC"
              value={userData.cvc}
              onChange={handleCvcChange}
              required
            />
          </Section>
        )}
        <Button type="submit" disabled={!user || isLoading}>
          {isLoading
            ? "Processing..."
            : user
            ? "Complete Order"
            : "Login to Checkout"}
        </Button>
      </Form>
    </CheckoutContainer>
  );
};

export default Checkout;
