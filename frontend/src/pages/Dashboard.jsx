import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

const Dashboard = () => {
  const { products, fetchProducts, loading } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, []);

  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );
  const lowStockProducts = products.filter((product) => product.stock < 10);
  const outOfStockProducts = products.filter((product) => product.stock === 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-gray-600 text-sm font-medium">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Dashboard</h1>
        <p className="text-gray-500">Welcome to your inventory dashboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border rounded shadow p-4">
          <h3 className="text-sm text-gray-500 mb-1">Total Products</h3>
          <p className="text-2xl font-semibold text-gray-800">{totalProducts}</p>
        </div>

        <div className="bg-white border rounded shadow p-4">
          <h3 className="text-sm text-gray-500 mb-1">Total Inventory Value</h3>
          <p className="text-2xl font-semibold text-green-600">
            Rp. {totalValue.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="bg-yellow-100 border border-yellow-300 rounded shadow p-4">
          <h3 className="text-sm text-yellow-800 mb-1">Low Stock Items</h3>
          <p className="text-2xl font-semibold text-yellow-700">
            {lowStockProducts.length}
          </p>
        </div>

        <div className="bg-red-100 border border-red-300 rounded shadow p-4">
          <h3 className="text-sm text-red-800 mb-1">Out of Stock</h3>
          <p className="text-2xl font-semibold text-red-700">
            {outOfStockProducts.length}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <Link
          to="/products/add"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          ➕ Add New Product
        </Link>
        <Link
          to="/products"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          📦 View All Products
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
