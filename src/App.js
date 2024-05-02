import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home.js';
import Historique from './Historique.js';

function App() {
  return (
      <Router>
          <div className="App">
              <Routes>
                  <Route path="/historique" element={<Historique />} />
                  <Route path="/" element={<Home />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;
