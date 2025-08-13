import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import './App.css';
// import CardsCarousel from './pages/CardsCarousel';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HomePage />
                  {/* <CardsCarousel /> */}
                </>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* <Route path="/" element={<CardsCarousel />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;