
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import FeaturedProducts from './components/FeaturedProduct';


function App() {
  return (
    <Router>
      <div className="App">
     
          <Header />
          <HeroBanner />
          <FeaturedProducts />
        
      </div>
    </Router>
  );
}

export default App;
