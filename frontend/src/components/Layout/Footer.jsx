import React from 'react';
import { Hotel, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="logo">
              <Hotel size={24} />
              <span>Grand Luxe Hotel</span>
            </div>
            <p className="footer-text">
              Tu destino de lujo para experiencias inolvidables. 
              Reserva tu estancia perfecta con nosotros.
            </p>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Contacto</h3>
            <div className="footer-contact">
              <div className="contact-item">
                <MapPin size={16} />
                <span>123 Luxury Avenue, Ciudad</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <Mail size={16} />
                <span>info@grandluxehotel.com</span>
              </div>
            </div>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Enlaces Rápidos</h3>
            <div className="footer-links">
              <a href="/rooms" className="footer-link">Habitaciones</a>
              <a href="/my-reservations" className="footer-link">Mis Reservas</a>
              <a href="/admin" className="footer-link">Panel Admin</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 Grand Luxe Hotel. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;