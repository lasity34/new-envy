import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import FeaturedProducts from './components/FeaturedProduct'; // Corrected the import if misspelled
import AboutUs from './components/AboutUs'; // Corrected the import if misspelled
import ContactUs from './components/ContactUs';
import ProductDetails from './components/ProductDetails'; // Ensure you import the ProductDetails

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <Route path="/" exact>
            <div id="hero"><HeroBanner /></div>
            <div id="featured"><FeaturedProducts /></div>
            <div id="about"><AboutUs /></div>
            <div id="contact"><ContactUs /></div>
          </Route>
          <Route path="/products/:id" component={ProductDetails} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
