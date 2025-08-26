import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ProductProvider } from './context/ProductContext.jsx'
import Products from './pages/Products.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AddProduct from './pages/AddProduct.jsx'
import Navbar from './components/Navbar.jsx'
import './App.css'

function App() {
  return (
    <Router>
      <ProductProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProduct />} />
        </Routes>
      </ProductProvider>
    </Router>
  )
}

export default App
