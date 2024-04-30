
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import FeaturedProducts from './components/FeaturedProduct';
import AboutUs from './components/About-us';
import ContactUs from './components/ContactUs';


function App() {
  return (
    <Router>
      <div className="App">
     
          <Header />
          <HeroBanner />
          <FeaturedProducts />
          <AboutUs />
          <ContactUs />
      </div>
    </Router>
  );
}

export default App;
