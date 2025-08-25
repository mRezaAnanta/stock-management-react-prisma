import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

const Products = () => {
  const { products, fetchProducts, deleteProduct, updateStock, loading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterStock, setFilterStock] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      await deleteProduct(id);
    }
  };

  const handleStockUpdate = async (id, currentStock, operation) => {
    const amount = prompt(`Enter amount to ${operation}:`);
    if (amount && !isNaN(amount) && parseInt(amount) > 0) {
      await updateStock(id, {
        stock: parseInt(amount),
        operation: operation
      });
    }
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      let matchesStockFilter = true;
      if (filterStock === 'low') {
        matchesStockFilter = product.stock < 10 && product.stock > 0;
      } else if (filterStock === 'out') {
        matchesStockFilter = product.stock === 0;
      } else if (filterStock === 'in') {
        matchesStockFilter = product.stock >= 10;
      }
      
      return matchesSearch && matchesStockFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'sku':
          return a.sku.localeCompare(b.sku);
        case 'price':
          return a.price - b.price;
        case 'stock':
          return a.stock - b.stock;
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Products</h1>
        <Link to="/products/add" className="btn primary">
          Add New Product
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="products-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Sort by Name</option>
            <option value="sku">Sort by SKU</option>
            <option value="price">Sort by Price</option>
            <option value="stock">Sort by Stock</option>
            <option value="date">Sort by Date Added</option>
          </select>

          <select value={filterStock} onChange={(e) => setFilterStock(e.target.value)}>
            <option value="all">All Products</option>
            <option value="in">In Stock (10+)</option>
            <option value="low">Low Stock (&lt;10)</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found.</p>
          {searchTerm || filterStock !== 'all' ? (
            <p>Try adjusting your search or filters.</p>
          ) : (
            <Link to="/products/add" className="btn primary">
              Add your first product
            </Link>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className={`product-card ${product.stock === 0 ? 'out-of-stock' : product.stock < 10 ? 'low-stock' : ''}`}>
              <div className="product-header">
                <h3>{product.name}</h3>
                <span className="product-sku">SKU: {product.sku}</span>
              </div>
              
              {product.description && (
                <p className="product-description">{product.description}</p>
              )}
              
              <div className="product-details">
                <div className="product-price">${product.price.toFixed(2)}</div>
                <div className={`product-stock ${product.stock === 0 ? 'zero' : product.stock < 10 ? 'low' : 'normal'}`}>
                  Stock: {product.stock}
                </div>
              </div>
              
              <div className="product-value">
                Total Value: ${(product.price * product.stock).toFixed(2)}
              </div>
              
              <div className="product-actions">
                <div className="stock-actions">
                  <button
                    onClick={() => handleStockUpdate(product.id, product.stock, 'add')}
                    className="btn small success"
                    title="Add Stock"
                  >
                    + Stock
                  </button>
                  <button
                    onClick={() => handleStockUpdate(product.id, product.stock, 'subtract')}
                    className="btn small warning"
                    title="Remove Stock"
                    disabled={product.stock === 0}
                  >
                    - Stock
                  </button>
                </div>
                
                <div className="crud-actions">
                  <Link
                    to={`/products/edit/${product.id}`}
                    className="btn small secondary"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="btn small danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
