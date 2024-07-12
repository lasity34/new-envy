import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HeroBanner from "./components/HeroBanner";
import FeaturedProducts from "./products/FeaturedProducts";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import ProductDetails from "./products/ProductDetails";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import ShoppingCart from './components/ShoppingCart';
import Signup from './auth/signup';
import Login from './auth/login';
import PrivateRoute from './auth/privateRoute';
import Dashboard from './admin/AdminProducts';
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from './auth/resetPassword';
import GeneralAdminPage from './admin/GeneralAdminPage';
import AdminProducts from './admin/AdminProducts';
import MockPayment from './payments/MockPayment';
import OrderConfirmation from './components/OrderConfirmation';
import SyncCartComponent from './components/SyncCartComponent';


const AppContent = () => {
  return (
    <div className="App">
      <Header />
      
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div id="hero">
                <HeroBanner />
              </div>
              <div id="featured">
                <FeaturedProducts />
              </div>
              <div id="about">
                <AboutUs />
              </div>
              <div id="contact">
                <ContactUs />
              </div>
            </>
          }
        />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<MockPayment />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<PrivateRoute path="/dashboard" element={<Dashboard />} />} />
        <Route path="/admin/dashboard" element={<PrivateRoute path="/admin/dashboard" element={<GeneralAdminPage />} />} />
        <Route path="/admin/products" element={<PrivateRoute path="/admin/products" element={<AdminProducts />} />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <UserProvider>
        <CartProvider>
          <SyncCartComponent />
          <AppContent />
        </CartProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
