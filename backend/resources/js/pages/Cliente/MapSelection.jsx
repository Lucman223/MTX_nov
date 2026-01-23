import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapClickHandler = ({ puntoActivo, setOrigen, setDestino }) => {
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

/**
 * MapSelection Component
 *
 * [ES] Componente interactivo de mapa para seleccionar origen y destino.
 *      Gestiona clics en el mapa para capturar coordenadas y visualiza marcadores y la posición del motorista.
 *
 * [FR] Composant de carte interactif pour sélectionner l'origine et la destination.
 *      Gère les clics sur la carte pour capturer les coordonnées et visualise les marqueurs et la position du chauffeur.
 */
const MapSelection = ({ origen, setOrigen, destino, setDestino, puntoActivo, motoristaPos }) => {
    const bamakoCoords = [12.6392, -8.0029];

    return (
        <MapContainer
            center={bamakoCoords}
            zoom={13}
            style={{ height: '100%', width: '100%', minHeight: '300px', borderRadius: '0.75rem', zIndex: 0 }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapClickHandler
                puntoActivo={puntoActivo}
                setOrigen={setOrigen}
                setDestino={setDestino}
            />
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
            {motoristaPos && <MotoristaMarker position={motoristaPos} />}
        </MapContainer>
    );
};

// Animated Marker Component
const MotoristaMarker = ({ position }) => {
    const [currentPos, setCurrentPos] = useState(position);

    // Very basic smoothing/interpolation effect
    // [ES] Efecto de suavizado básico.
    useEffect(() => {
        if (!position) return;
        const start = currentPos;
        const end = position;

        // If distance is large, jump (initial load)
        if (Math.abs(start[0] - end[0]) > 0.1 || Math.abs(start[1] - end[1]) > 0.1) {
            setCurrentPos(end);
            return;
        }

        // Simple interpolation logic could go here, but for now React state update 
        // will cause a render. Leaflet handles marker moves reasonably well.
        // We update state to trigger re-render of Marker
        setCurrentPos(position);

    }, [position]);

    return (
        <Marker position={currentPos} icon={MotoristaIcon}>
            <Popup>🛵 Tu Moto</Popup>
        </Marker>
    );
};

// Custom Icon for Bike
const MotoristaIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/171/171254.png', // Generic bike icon URL or local asset
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    className: 'motorista-marker-icon'
});

export default MapSelection;
