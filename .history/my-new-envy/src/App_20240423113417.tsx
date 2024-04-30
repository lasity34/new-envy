import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import FeaturedProducts from './components/FeaturedProducts';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import ProductDetails from './components/ProductDetails'; // Ensure you import the ProductDetails

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <div id="hero"><HeroBanner /></div>
              <div id="featured"><FeaturedProducts /></div>
              <div id="about"><AboutUs /></div>
              <div id="contact"><ContactUs /></div>
            </>
          } />
          <Route path="/products/:id" element={<ProductDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

