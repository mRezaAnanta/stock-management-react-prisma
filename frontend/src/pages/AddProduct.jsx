import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { productsAPI } from '../services/api'

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    sku: '',
  })
  const { createProduct, loading, error, clearError } = useProducts()
  const [skuGenerating, setSkuGenerating] = useState(false)
  const navigate = useNavigate()

  React.useEffect(() => {
    clearError()
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const generateRandomSKU = async () => {
    setSkuGenerating(true)

    // Generate a random SKU with format: PRD-YYYYMMDD-XXXXX
    const generateSKU = () => {
      const now = new Date()
      const date = now.toISOString().slice(0, 10).replace(/-/g, '')
      const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase()
      return `PRD-${date}-${randomPart}`
    }

    try {
      let attempts = 0
      let isUnique = false
      let generatedSKU = ''

      // Try to generate a unique SKU (max 10 attempts)
      while (!isUnique && attempts < 10) {
        generatedSKU = generateSKU()

        try {
          // Check if SKU already exists by trying to get all products and checking
          const response = await productsAPI.getProducts()
          const existingSKUs = response.data.products.map(product => product.sku)
          isUnique = !existingSKUs.includes(generatedSKU)
        } catch (error) {
          // If there's an error fetching products (e.g., no products yet), assume SKU is unique
          isUnique = true
        }

        attempts++
      }

      if (isUnique) {
        setFormData({
          ...formData,
          sku: generatedSKU
        })
      } else {
        // Fallback: add timestamp to ensure uniqueness
        const timestamp = Date.now().toString().slice(-5)
        const fallbackSKU = `PRD-${timestamp}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`
        setFormData({
          ...formData,
          sku: fallbackSKU
        })
      }
    } catch (error) {
      console.error('Error generating SKU:', error)
      // Fallback generation without API check
      const fallbackSKU = generateSKU()
      setFormData({
        ...formData,
        sku: fallbackSKU
      })
    } finally {
      setSkuGenerating(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const result = await createProduct({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0,
    })

    if (result.success) {
      navigate('/products')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Add New Product</h1>
        <Link to="/products" className="text-blue-600 hover:underline">
          ← Back to Products
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter product name"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          <input
            type="text"
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            required
            placeholder="Enter unique SKU"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="button"
            onClick={generateRandomSKU}
            disabled={skuGenerating}
            title="Generate random unique SKU"
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap
${skuGenerating
? 'bg-gray-300 text-gray-500 cursor-not-allowed'
: 'bg-blue-600 text-white hover:bg-blue-700'}
focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {skuGenerating ? '🔄' : '🎲'}
            {skuGenerating ? 'Generating...' : 'Generate'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block font-medium mb-1">
              Price (Rp) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="stock" className="block font-medium mb-1">
              Initial Stock
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description (optional)"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Link
            to="/products"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddProduct
