import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          Stock Manager
        </Link>

        <div className="nav-items">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Dashboard
          </Link>
          <Link 
            to="/products" 
            className={location.pathname.includes('/products') ? 'nav-link active' : 'nav-link'}
          >
            Products
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
