import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';

const ClienteDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    
    const [origen, setOrigen] = useState(null);
    const [destino, setDestino] = useState(null);
    const [puntoActivo, setPuntoActivo] = useState('origen'); // 'origen' o 'destino'

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSolicitarViaje = () => {
        if (!origen || !destino) {
            alert('Por favor, selecciona un origen y un destino en el mapa.');
            return;
        }
        console.log('Solicitando viaje desde:', origen, 'hacia:', destino);
        // Próximamente: conectar con la API
    };

    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                if (puntoActivo === 'origen') {
                    setOrigen([lat, lng]);
                } else {
                    setDestino([lat, lng]);
                }
            },
        });
        return null;
    };
    
    const bamakoCoords = [12.6392, -8.0029];

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Panel de Cliente</h1>
                <button onClick={handleLogout} style={{ padding: '0.75rem 1.5rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Cerrar Sesión
                </button>
            </div>
            
            <p>Selecciona en el mapa el punto de origen y de destino.</p>

            <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                <button onClick={() => setPuntoActivo('origen')} style={{ padding: '0.5rem 1rem', border: puntoActivo === 'origen' ? '2px solid #007bff' : '2px solid transparent', borderRadius: '5px' }}>
                    Fijar Origen
                </button>
                <button onClick={() => setPuntoActivo('destino')} style={{ padding: '0.5rem 1rem', border: puntoActivo === 'destino' ? '2px solid #28a745' : '2px solid transparent', borderRadius: '5px' }}>
                    Fijar Destino
                </button>
            </div>

            <MapContainer center={bamakoCoords} zoom={13} style={{ flexGrow: 1, height: '60%', width: '100%', borderRadius: '8px' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapClickHandler />
                {origen && (
                    <Marker position={origen}>
                        <Popup>Punto de Origen</Popup>
                    </Marker>
                )}
                {destino && (
                    <Marker position={destino}>
                        <Popup>Punto de Destino</Popup>
                    </Marker>
                )}
            </MapContainer>

            <div style={{ marginTop: '1.5rem' }}>
                <p><strong>Origen:</strong> {origen ? `Lat: ${origen[0].toFixed(4)}, Lng: ${origen[1].toFixed(4)}` : 'No seleccionado'}</p>
                <p><strong>Destino:</strong> {destino ? `Lat: ${destino[0].toFixed(4)}, Lng: ${destino[1].toFixed(4)}` : 'No seleccionado'}</p>
                <button onClick={handleSolicitarViaje} style={{ padding: '0.75rem 1.5rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '1rem' }}>
                    Solicitar Viaje
                </button>
            </div>
        </div>
    );
};

export default ClienteDashboard;
