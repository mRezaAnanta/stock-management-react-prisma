import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path)

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Stock Manager
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded text-sm font-medium transition ${
isActive('/') && location.pathname === '/'
? 'bg-blue-600 text-white'
: 'text-gray-700 hover:bg-gray-100'
}`}
            >
              Dashboard
            </Link>

            <Link
              to="/products"
              className={`px-3 py-2 rounded text-sm font-medium transition ${
isActive('/products')
? 'bg-blue-600 text-white'
: 'text-gray-700 hover:bg-gray-100'
}`}
            >
              Products
            </Link>

            <div className="flex items-center space-x-3 pl-4 border-l border-gray-300">
              <span className="text-sm text-gray-600">Welcome, <span className="font-semibold">{user?.name}</span></span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
              >
                Register
              </Link>
            </div>
          )}
      </div>
    </nav>
  )
}

export default Navbar
