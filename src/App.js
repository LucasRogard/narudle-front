import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home.js';
import Historique from './Historique.js';
import ProtectedRoute from './ProtectedRoute'; // Importer ProtectedRoute

function App() {
    return (
        <Router>
            <div className="App">
                <img src="Narudle_title.png" className="App-logo" alt="logo"/>
                <Routes>
                    <Route path="/historique" element={<ProtectedRoute><Historique /></ProtectedRoute>} />
                    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
