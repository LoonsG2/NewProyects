import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      // Usar el nombre del servicio Docker en lugar de localhost
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/rooms`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setError('No se pudieron cargar las habitaciones. Verifica que el backend esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rooms-page">
        <div className="container">
          <h1>Nuestras Habitaciones</h1>
          <div className="loading">Cargando habitaciones...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rooms-page">
        <div className="container">
          <h1>Nuestras Habitaciones</h1>
          <div className="error-message" style={{ 
            background: 'var(--error-500)', 
            color: 'white', 
            padding: 'var(--space-4)', 
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center'
          }}>
            {error}
            <br />
            <button 
              onClick={fetchRooms} 
              className="btn btn-secondary"
              style={{ marginTop: 'var(--space-4)' }}
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rooms-page">
      <div className="container">
        <h1>Nuestras Habitaciones</h1>
        
        {rooms.length === 0 ? (
          <div className="empty-state">
            <p>No hay habitaciones disponibles en este momento.</p>
          </div>
        ) : (
          <div className="rooms-grid">
            {rooms.map(room => (
              <div key={room._id} className="room-card">
                <div className="room-image">
                  <div className="room-type">{room.type}</div>
                </div>
                
                <div className="room-content">
                  <h3>Habitación {room.roomNumber}</h3>
                  <p className="room-description">{room.description}</p>
                  
                  <div className="room-details">
                    <div className="room-detail">
                      <Users size={16} />
                      <span>Máx. {room.maxGuests} personas</span>
                    </div>
                  </div>

                  <div className="amenities-list">
                    {room.amenities?.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="amenity-tag">
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <div className="room-price">
                    ${room.price} <span>por noche</span>
                  </div>

                  <Link 
                    to={`/rooms/${room._id}`} 
                    className="btn btn-primary"
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;