import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Hotel, Calendar, User } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="container">
        <div className="flex justify-between items-center">
          <Link to="/" className="logo">
            <Hotel size={32} />
            <span>Grand Luxe Hotel</span>
          </Link>
          
          <nav className="nav">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Inicio
            </Link>
            <Link 
              to="/rooms" 
              className={`nav-link ${location.pathname === '/rooms' ? 'active' : ''}`}
            >
              Habitaciones
            </Link>
            <Link 
              to="/my-reservations" 
              className={`nav-link ${location.pathname === '/my-reservations' ? 'active' : ''}`}
            >
              <Calendar size={16} />
              Mis Reservas
            </Link>
            <Link 
              to="/admin" 
              className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
            >
              <User size={16} />
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;