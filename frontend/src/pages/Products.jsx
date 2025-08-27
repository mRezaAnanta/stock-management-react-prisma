import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductContext.jsx'

const Products = () => {
  const { products, fetchProducts, deleteProduct, loading, error } = useProducts()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [filterStock, setFilterStock] = useState('all')

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      await deleteProduct(id)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))

    let matchesStockFilter = true
    if (filterStock === 'low') {
      matchesStockFilter = product.stock < 10 && product.stock > 0
    } else if (filterStock === 'out') {
      matchesStockFilter = product.stock === 0
    } else if (filterStock === 'in') {
      matchesStockFilter = product.stock >= 10
    }

    return matchesSearch && matchesStockFilter
  })
  .sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'sku-asc':
        return a.sku.localeCompare(b.sku)
      case 'sku-desc':
        return b.sku.localeCompare(a.sku)
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'stock-low':
        return a.stock - b.stock
      case 'stock-high':
        return b.stock - a.stock
      case 'date-new':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'date-old':
        return new Date(a.createdAt) - new Date(b.createdAt)
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-gray-600 text-sm font-medium">Loading products...</span>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Product Table</h2>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white shadow rounded-md">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="min-w-[180px]">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name-asc">Sort by Name (Ascending)</option>
            <option value="name-desc">Sort by Name (Descending)</option>
            <option value="sku-asc">Sort by SKU (Ascending)</option>
            <option value="sku-desc">Sort by SKU (Descending)</option>
            <option value="price-low">Sort by Price (Lowest)</option>
            <option value="price-high">Sort by Price (Highest)</option>
            <option value="stock-low">Sort by Stock (Lowest)</option>
            <option value="stock-high">Sort by Stock (Highest)</option>
            <option value="date-old">Sort by Date Added (Oldest)</option>
            <option value="date-new">Sort by Date Added (Newest)</option>
          </select>
        </div>

        <div className="min-w-[180px]">
          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Products</option>
            <option value="in">In Stock (10+)</option>
            <option value="low">Low Stock (&lt10)</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        <div className="min-w-fit">
          <Link
            to="/products/add"
            className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition duration-200"
          >
            Add New Product
          </Link>
        </div>
      </div>

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
            {filteredProducts.map((product, index) => {
              const totalValue = product.price * product.stock
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
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Products
