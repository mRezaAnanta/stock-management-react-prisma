import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register';
import Products from './pages/Products.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AddProduct from './pages/AddProduct.jsx'
import EditProduct from './pages/EditProduct.jsx'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/products" element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            } />
            <Route path="/products/add" element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            } />
            <Route path="/products/edit/:id" element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            } />
          </Routes>
        </ProductProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
