import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  // Helper function to check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/">LoansFlexi</Link>
          <h5 style={{color:'white'}}>Where Flexibility Meets Finance.</h5>
        </div>
        <ul className="navbar-menu">
          <li>
            <Link 
              to="/" 
              className={isActive('/') ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/loans" 
              className={isActive('/loans') ? 'active' : ''}
            >
              Loans
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={isActive('/about') ? 'active' : ''}
            >
              About
            </Link>
          </li>
          <li>
            <Link 
              to="/forms" 
              className={isActive('/forms') ? 'active' : ''}
            >
              Apply
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              className={isActive('/contact') ? 'active' : ''}
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

