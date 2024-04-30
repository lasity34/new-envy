
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';


function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Header />
        </header>
      </div>
    </Router>
  );
}

export default App;
