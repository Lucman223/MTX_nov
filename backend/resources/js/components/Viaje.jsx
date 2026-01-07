import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Arreglo para el ícono por defecto de Leaflet que a veces falla con Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/**
 * Viaje Component
 *
 * [ES] Visualizador de mapas genérico para el seguimiento de la ubicación del motorista mediante WebSockets (Echo).
 *      Se suscribe a canales privados para recibir actualizaciones de coordenadas en tiempo real.
 *
 * [FR] Visualiseur de cartes générique pour le suivi de la localisation du chauffeur via WebSockets (Echo).
 *      S'abonne à des canaux privés pour recevoir des mises à jour de coordonnées en temps réel.
 */
function Viaje() {
  const { viajeId } = useParams();
  const [position, setPosition] = useState(null); // [lat, lng]
  const mapRef = useRef();

  const initialCenter = [5.345317, -4.024429]; // Coordenadas iniciales (Abiyán)

  useEffect(() => {
    console.log(`Suscribiéndose al canal: viaje.${viajeId}`);

    const channel = window.Echo.private(`viaje.${viajeId}`);

    channel.listen('.location-updated', (data) => {
      console.log('Ubicación recibida:', data);
      const newPosition = [parseFloat(data.lat), parseFloat(data.lng)];
      setPosition(newPosition);
    });

    // Limpieza al desmontar el componente
    return () => {
      console.log(`Desuscribiéndose del canal: viaje.${viajeId}`);
      channel.stopListening('.location-updated');
      window.Echo.leave(`viaje.${viajeId}`);
    };
  }, [viajeId]); // El efecto se vuelve a ejecutar si el viajeId cambia

  useEffect(() => {
    // Mover el mapa a la nueva posición
    if (position && mapRef.current) {
      mapRef.current.flyTo(position, 15); // Animar el movimiento
    }
  }, [position]);

  return (
    <MapContainer
      center={position || initialCenter}
      zoom={13}
      style={{ height: '100vh', width: '100%' }}
      whenCreated={map => mapRef.current = map}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {position && (
        <Marker position={position}>
          <Popup>
            El motorista está aquí.
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default Viaje;
