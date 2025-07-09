import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Restaurant from './pages/Restaurant';
import Restaurants from './pages/Restaurants';
import Menu from './pages/Menu';
import Order from './pages/Order';
import Orders from './pages/Orders';
import Reservations from './pages/Reservations';
import Recommendations from './pages/Recommendations';
import Layout from './components/Layout';

function AppRoutes({ isLoggedIn, onLogout }) {
  return (
    <Layout isLoggedIn={isLoggedIn} onLogout={onLogout}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurants/:id" element={<Restaurant />} />
        <Route path="/menus/:restaurantId" element={<Menu />} />
        <Route path="/order" element={<Order />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/recommendations" element={<Recommendations />} />
      </Routes>
    </Layout>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <Router>
      <AppRoutes isLoggedIn={isLoggedIn} onLogout={handleLogout} />
    </Router>
  );
}

export default App; 