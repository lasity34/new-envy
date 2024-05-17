import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HeroBanner from "./components/HeroBanner";
import FeaturedProducts from "./components/FeaturedProducts";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import ProductDetails from "./components/ProductDetails";
import { CartProvider } from "./context/CartContext";
import ShoppingCart from './components/ShoppingCart';
import Signup from './auth/signup';
import Login from './auth/login';
import PrivateRoute from './auth/privateRoute';
import Dashboard from './admin/Dashboard';

function App() {
  return (
    <CartProvider>
      <Router>
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
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<PrivateRoute path="/dashboard" element={<Dashboard />} />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
