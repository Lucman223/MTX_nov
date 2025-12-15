import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const DriverActiveTrip = () => {
    const navigate = useNavigate();
    const [viaje, setViaje] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                // Driver endpoint for current trip (reusing the same logic for now)
                const response = await axios.get('/api/viajes/actual', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!response.data || Object.keys(response.data).length === 0) {
                    setError('No tienes un viaje asignado actualmente.');
                    setLoading(false);
                    return;
                }

                setViaje(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching trip:", err);
                setError('Error al cargar la información del viaje.');
                setLoading(false);
            }
        };

        fetchTrip();
    }, [navigate]);

    const handleOpenNavigation = () => {
        if (!viaje) return;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${viaje.destino_lat},${viaje.destino_lng}&travelmode=driving`;
        window.open(url, '_blank');
    };

    const handleStatusChange = async (newStatus) => {
        if (!confirm(`¿Estás seguro de cambiar el estado a: ${newStatus.replace('_', ' ').toUpperCase()}?`)) return;

        setUpdating(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/viajes/${viaje.id}/estado`, {
                estado: newStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local state or redirect
            if (newStatus === 'completado') {
                alert("¡Viaje completado con éxito!");
                navigate('/motorista/dashboard');
            } else {
                setViaje(prev => ({ ...prev, estado: newStatus }));
            }
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Error al actualizar el estado del viaje.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Cargando viaje...</div>;
    if (error) return (
        <div className="flex flex-col justify-center items-center h-screen gap-4">
            <h2 className="text-xl text-red-600">{error}</h2>
            <button onClick={() => navigate('/motorista/dashboard')} className="px-4 py-2 bg-blue-600 text-white rounded">
                Volver al Panel
            </button>
        </div>
    );

    return (
        <div className="flex flex-col h-screen relative bg-gray-100">
            {/* Header / Client Info */}
            <div className="absolute top-4 left-4 right-4 z-[400] bg-white p-4 rounded-xl shadow-lg border-l-4 border-blue-500">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs text-blue-500 font-bold uppercase">Pasajero</p>
                        <h2 className="text-xl font-bold text-gray-800">{viaje.cliente ? viaje.cliente.nombre : 'Cliente Desconocido'}</h2>
                        <a href={`tel:${viaje.cliente?.telefono}`} className="text-sm text-gray-500 underline flex items-center gap-1 mt-1">
                            📞 {viaje.cliente?.telefono}
                        </a>
                    </div>
                    <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${viaje.estado === 'en_curso' ? 'bg-green-100 text-green-700' :
                                'bg-blue-100 text-blue-700'
                            }`}>
                            {viaje.estado.replace('_', ' ').toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Map */}
            <div className="flex-grow z-0">
                <MapContainer
                    center={[viaje.origen_lat, viaje.origen_lng]}
                    zoom={14}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {/* Origin */}
                    <Marker position={[viaje.origen_lat, viaje.origen_lng]}>
                        <Popup>Recoger Aquí</Popup>
                    </Marker>

                    {/* Destination */}
                    <Marker position={[viaje.destino_lat, viaje.destino_lng]}>
                        <Popup>Destino Final</Popup>
                    </Marker>

                    <Polyline
                        positions={[
                            [viaje.origen_lat, viaje.origen_lng],
                            [viaje.destino_lat, viaje.destino_lng]
                        ]}
                        color="blue"
                        weight={5}
                        opacity={0.7}
                    />
                </MapContainer>
            </div>

            {/* Controls */}
            <div className="absolute bottom-6 left-4 right-4 z-[400] flex flex-col gap-3">
                <button
                    onClick={handleOpenNavigation}
                    className="w-full bg-white text-blue-600 py-3 rounded-xl shadow-md font-bold text-lg border border-blue-100 items-center justify-center flex gap-2"
                >
                    📍 Navegar con Google Maps
                </button>

                <div className="flex gap-3">
                    {viaje.estado === 'aceptado' && (
                        <button
                            onClick={() => handleStatusChange('en_curso')}
                            disabled={updating}
                            className="flex-1 bg-blue-600 text-white py-4 rounded-xl shadow-lg font-bold text-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            ▶️ Iniciar Viaje
                        </button>
                    )}

                    {viaje.estado === 'en_curso' && (
                        <button
                            onClick={() => handleStatusChange('completado')}
                            disabled={updating}
                            className="flex-1 bg-green-600 text-white py-4 rounded-xl shadow-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            🏁 Finalizar Viaje
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DriverActiveTrip;
