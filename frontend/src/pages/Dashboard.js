import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

const Dashboard = () => {
  const { products, fetchProducts, loading } = useProducts();

  useEffect(() => {
    fetchProducts()
  }, []);

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const lowStockProducts = products.filter(product => product.stock < 10);
  const outOfStockProducts = products.filter(product => product.stock === 0);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back!</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-number">{totalProducts}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Inventory Value</h3>
          <p className="stat-number">${totalValue.toFixed(2)}</p>
        </div>
        
        <div className="stat-card warning">
          <h3>Low Stock Items</h3>
          <p className="stat-number">{lowStockProducts.length}</p>
        </div>
        
        <div className="stat-card danger">
          <h3>Out of Stock</h3>
          <p className="stat-number">{outOfStockProducts.length}</p>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/products/add" className="action-button primary">
          Add New Product
        </Link>
        <Link to="/products" className="action-button secondary">
          View All Products
        </Link>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="alert-section">
          <h3>⚠️ Low Stock Alert</h3>
          <div className="alert-products">
            {lowStockProducts.slice(0, 5).map(product => (
              <div key={product.id} className="alert-item">
                <span className="product-name">{product.name}</span>
                <span className="product-stock">Stock: {product.stock}</span>
              </div>
            ))}
            {lowStockProducts.length > 5 && (
              <Link to="/products" className="view-more">
                View {lowStockProducts.length - 5} more...
              </Link>
            )}
          </div>
        </div>
      )}

      {outOfStockProducts.length > 0 && (
        <div className="alert-section danger">
          <h3>🚨 Out of Stock</h3>
          <div className="alert-products">
            {outOfStockProducts.slice(0, 5).map(product => (
              <div key={product.id} className="alert-item">
                <span className="product-name">{product.name}</span>
                <span className="product-sku">SKU: {product.sku}</span>
              </div>
            ))}
            {outOfStockProducts.length > 5 && (
              <Link to="/products" className="view-more">
                View {outOfStockProducts.length - 5} more...
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
