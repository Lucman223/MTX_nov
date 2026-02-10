import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import RatingModal from '../../components/Common/RatingModal';

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

// Custom Icons
const MotoristaIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448636.png', // Motorcycle icon placeholder
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});

const ClientIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // User icon placeholder
    iconSize: [35, 35],
    iconAnchor: [17, 35]
});

/**
 * ClientActiveTrip Component
 *
 * [ES] Pantalla principal del cliente durante un viaje en curso. 
 *      Incluye mapa Leaflet, estado del trayecto (aceptado, en curso), datos del conductor y modal de calificación al finalizar.
 *
 * [FR] Écran principal du client lors d'un trajet en cours.
 *      Comprend une carte Leaflet, le statut du trajet (accepté, en cours), les données du chauffeur et un modal de notation à la fin.
 */
const ClientActiveTrip = () => {
    const navigate = useNavigate();
    const [viaje, setViaje] = useState(null);
    const [loading, setLoading] = useState(true);
    const [motoristaPos, setMotoristaPos] = useState(null);
    const [showRating, setShowRating] = useState(false);
    const [error, setError] = useState(null);

    // Fetch current trip
    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get('/api/viajes/actual', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // If no active trip, redirect or show message
                if (!response.data || Object.keys(response.data).length === 0) {
                    setError('No tienes un viaje activo en este momento.');
                    setLoading(false);
                    return;
                }

                const trip = response.data;
                if (trip) {
                    trip.origen_lat = parseFloat(trip.origen_lat);
                    trip.origen_lng = parseFloat(trip.origen_lng);
                    trip.destino_lat = parseFloat(trip.destino_lat);
                    trip.destino_lng = parseFloat(trip.destino_lng);
                }
                setViaje(trip);

                // Simulate driver position near origin for now
                if (response.data.origen_lat && response.data.origen_lng) {
                    setMotoristaPos([
                        parseFloat(response.data.origen_lat) - 0.002,
                        parseFloat(response.data.origen_lng) - 0.002
                    ]);
                }

                setLoading(false);
            } catch (err) {
                setError('Error al cargar la información del viaje.');
                setLoading(false);
            }
        };

        fetchTrip();

        // Polling for status updates every 5 seconds
        const interval = setInterval(() => {
            fetchTrip();
        }, 5000);

        return () => clearInterval(interval);
    }, [navigate]);

    // Effect to check if trip is completed to show rating
    useEffect(() => {
        if (viaje && viaje.estado === 'completado') {
            setShowRating(true);
        }
    }, [viaje]);

    const handleRatingSubmit = async ({ rating, comment }) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/viajes/${viaje.id}/calificar`, {
                puntuacion: rating,
                comentario: comment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Close modal and redirect to dashboard/history
            setShowRating(false);
            navigate('/cliente/dashboard');
        } catch (err) {
            alert("Error al enviar la calificación. Intenta de nuevo.");
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Cargando viaje...</div>;
    if (error) return (
        <div className="flex flex-col justify-center items-center h-screen gap-4">
            <h2 className="text-xl text-red-600">{error}</h2>
            <button onClick={() => navigate('/cliente/dashboard')} className="px-4 py-2 bg-blue-600 text-white rounded">
                Volver al Inicio
            </button>
        </div>
    );

    return (
        <div className="flex flex-col h-screen relative bg-gray-100">
            {/* Header Info */}
            <div className="absolute top-4 left-4 right-4 z-[400] bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">En Viaje</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 text-xs rounded-full font-semibold ${viaje.estado === 'en_curso' ? 'bg-green-100 text-green-700' :
                                viaje.estado === 'aceptado' ? 'bg-blue-100 text-blue-700' :
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                {viaje.estado.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-500">
                                #{viaje.id.substring(0, 8)}...
                            </span>
                        </div>
                    </div>
                    {viaje.motorista && (
                        <div className="text-right">
                            <p className="font-semibold text-gray-800">{viaje.motorista.nombre}</p>
                            <p className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block">
                                {viaje.motorista.matricula || 'Sin matrícula'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Map */}
            <div className="flex-grow z-0">
                <MapContainer
                    center={[parseFloat(viaje.origen_lat), parseFloat(viaje.origen_lng)]}
                    zoom={14}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />

                    {/* Origin Marker */}
                    <Marker position={[parseFloat(viaje.origen_lat), parseFloat(viaje.origen_lng)]} icon={ClientIcon}>
                        <Popup>Tú (Origen)</Popup>
                    </Marker>

                    {/* Destination Marker */}
                    <Marker position={[parseFloat(viaje.destino_lat), parseFloat(viaje.destino_lng)]}>
                        <Popup>Destino</Popup>
                    </Marker>

                    {/* Driver Marker (Simulated) */}
                    {motoristaPos && (
                        <Marker position={[parseFloat(motoristaPos[0]), parseFloat(motoristaPos[1])]} icon={MotoristaIcon}>
                            <Popup>Motorista</Popup>
                        </Marker>
                    )}

                    {/* Route Line (Simple straight line for now) */}
                    <Polyline
                        positions={[
                            [parseFloat(viaje.origen_lat), parseFloat(viaje.origen_lng)],
                            [parseFloat(viaje.destino_lat), parseFloat(viaje.destino_lng)]
                        ]}
                        color="blue"
                        weight={4}
                        opacity={0.6}
                        dashArray="10, 10"
                    />
                </MapContainer>
            </div>

            {/* Contact / Actions */}
            <div className="absolute bottom-6 left-4 right-4 z-[400] flex gap-3">
                <button className="flex-1 bg-white text-gray-800 py-3 rounded-xl shadow-lg font-semibold border hover:bg-gray-50">
                    📞 Llamar Chofer
                </button>
                <button className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl shadow-lg font-semibold border border-red-100 hover:bg-red-100">
                    🆘 Emergencia
                </button>
            </div>

            {/* Rating Modal */}
            <RatingModal
                isOpen={showRating}
                onClose={() => navigate('/cliente/dashboard')}
                onSubmit={handleRatingSubmit}
                motoristaName={viaje.motorista ? viaje.motorista.nombre : 'el motorista'}
            />
        </div>
    );
};

export default ClientActiveTrip;
