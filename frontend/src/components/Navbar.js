import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          💰 Finance Tracker
        </Link>
        <ul className="navbar-menu">
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/transactions" 
              className={location.pathname === '/transactions' ? 'active' : ''}
            >
              Transactions
            </Link>
          </li>
          <li>
            <Link 
              to="/accounts" 
              className={location.pathname === '/accounts' ? 'active' : ''}
            >
              Accounts
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
