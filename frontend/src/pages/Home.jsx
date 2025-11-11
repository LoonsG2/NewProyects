import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Wifi, Utensils } from 'lucide-react';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Bienvenido al Grand Luxe Hotel</h1>
            <p className="hero-subtitle">
              Experimenta el lujo en su máxima expresión. 
              Reserva tu estancia perfecta con nosotros.
            </p>
            <Link to="/rooms" className="btn btn-primary">
              Ver Habitaciones
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Por qué elegirnos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card">
              <Star className="feature-icon" />
              <h3>Servicio 5 Estrellas</h3>
              <p>Experiencia de lujo con atención personalizada las 24 horas.</p>
            </div>
            <div className="feature-card">
              <Wifi className="feature-icon" />
              <h3>Comodidades Modernas</h3>
              <p>WiFi de alta velocidad y tecnología de última generación.</p>
            </div>
            <div className="feature-card">
              <Utensils className="feature-icon" />
              <h3>Gastronomía Excepcional</h3>
              <p>Restaurantes gourmet y servicio a la habitación premium.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;