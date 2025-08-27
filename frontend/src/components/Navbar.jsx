import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation()

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path)

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Stock Manager
        </Link>

        <div className="flex space-x-4">
          <Link
            to="/"
            className={`px-3 py-2 rounded text-sm font-medium ${
              isActive('/') && location.pathname === '/'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/products"
            className={`px-3 py-2 rounded text-sm font-medium ${
              isActive('/products')
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Products
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
