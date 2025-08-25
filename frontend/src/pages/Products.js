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
            {/* PRODUK */}
            <table className="">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Total Value</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr>
                    <th>{product.name}</th>
                    <th>{product.sku}</th>
                    <th>{product.price}</th>
                    <th>{product.stock}</th>
                    <th>{product.price * product.stock}</th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};

export default Products;
