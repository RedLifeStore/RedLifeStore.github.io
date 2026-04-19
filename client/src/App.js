import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import AuthCallback from './pages/AuthCallback';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('/api/auth/me');
          setUser(response.data.user);
        }
      } catch (err) {
        console.log('Not authenticated');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Header user={user} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={user ? <Home /> : <Login setUser={setUser} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/callback" element={<AuthCallback setUser={setUser} />} />
            <Route path="/shop" element={user ? <Shop /> : <Navigate to="/login" />} />
            <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
            <Route path="/account" element={user ? <Account user={user} /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
