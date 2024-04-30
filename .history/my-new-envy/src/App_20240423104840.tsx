
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
          <div id="hero"><HeroBanner /></div>
        <div id="featured"><FeaturedProducts /></div>
        <div id="about"><AboutUs /></div>
        <div id="contact"><ContactUs /></div>
      </div>
    </Router>
  );
}

export default App;
