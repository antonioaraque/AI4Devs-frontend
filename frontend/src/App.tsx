import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Positions from './components/Positions';
import Position from './components/Position';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Positions />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/position/:id" element={<Position />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
