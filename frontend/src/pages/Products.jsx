import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext.jsx';

const Products = () => {
  const { products, fetchProducts, deleteProduct, updateStock, loading, error } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      await deleteProduct(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-gray-600 text-sm font-medium">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Product Table</h2>

      <Link to="/products/add" className="inline-block mb-2 px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition duration-200">
        Add New Product
      </Link>
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">No</th>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">SKU</th>
              <th className="py-2 px-4 border-b text-left">Price</th>
              <th className="py-2 px-4 border-b text-left">Stock</th>
              <th className="py-2 px-4 border-b text-left">Total Value</th>
              <th className="py-2 px-4 border-b text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              const totalValue = product.price * product.stock;
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{product.name}</td>
                  <td className="py-2 px-4 border-b">{product.sku}</td>
                  <td className="py-2 px-4 border-b">Rp. {product.price.toLocaleString('id-ID')}</td>
                  <td className="py-2 px-4 border-b">{product.stock}</td>
                  <td className="py-2 px-4 border-b">Rp. {totalValue.toLocaleString('id-ID')}</td>
                  <td className="py-2 px-4 border-b">
                    <Link
                      to={`/products/edit/${product.id}`}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition mr-2"                  >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
