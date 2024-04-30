
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';

function App() {
  return (
    <Router>
      <div className="App">
     
          <Header />
          <HeroBanner />
      </div>
    </Router>
  );
}

export default App;
