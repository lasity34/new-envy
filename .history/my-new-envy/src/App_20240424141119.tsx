import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HeroBanner from "./components/HeroBanner";
import FeaturedProducts from "./components/FeaturedProducts";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import ProductDetails from "./components/ProductDetails"; // Ensure you import the ProductDetails
import { CartProvider } from "./context/CartContext";
import ShoppingCart from './components/ShoppingCart';

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
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
