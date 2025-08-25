import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext.js';
import Navbar from './components/Navbar';
import Products from './pages/Products';
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';
import './App.css';

function App() {
  return (
    <Router>
      <ProductProvider>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route 
                path="/dashboard" 
                element={
                  <Dashboard />
                } 
              />
              <Route 
                path="/products" 
                element={
                  <Products />
                } 
              />
              <Route 
                path="/products/add" 
                element={
                  <AddProduct />
                } 
              />
            </Routes>
          </main>
        </div>
      </ProductProvider>
    </Router>
  );
}

export default App;
