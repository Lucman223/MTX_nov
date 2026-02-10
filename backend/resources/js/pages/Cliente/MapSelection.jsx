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

// [PHASE 2] Helper to guarantee numeric coordinates in Map
const safeParseCoord = (val, label = 'unknown') => {
    const parsed = parseFloat(val);
    if (isNaN(parsed)) {
        console.error(`[MAP_COORD_ERROR] Failed to parse coordinate for ${label}:`, val);
        return 0; // Fallback to 0 to prevent issues
    }
    return parsed;
};

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
            {console.log('[LOG_MAP_1] Rendering MapSelection with:', { origen, destino, motoristaPos })}
            {origen && Array.isArray(origen) && origen.length >= 2 && (
                <Marker position={[safeParseCoord(origen[0], 'map_origen_lat'), safeParseCoord(origen[1], 'map_origen_lng')]}>
                    <Popup>Punto de Origen</Popup>
                </Marker>
            )}
            {destino && Array.isArray(destino) && destino.length >= 2 && (
                <Marker position={[safeParseCoord(destino[0], 'map_destino_lat'), safeParseCoord(destino[1], 'map_destino_lng')]}>
                    <Popup>Punto de Destino</Popup>
                </Marker>
            )}
            {motoristaPos && Array.isArray(motoristaPos) && motoristaPos.length >= 2 && (
                <MotoristaMarker position={[safeParseCoord(motoristaPos[0], 'map_moto_lat'), safeParseCoord(motoristaPos[1], 'map_moto_lng')]} />
            )}
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

    console.log('[LOG_MAP_2] Rendering MotoristaMarker at:', currentPos);
    return (
        <Marker
            position={[
                safeParseCoord(currentPos[0], 'moto_marker_lat'),
                safeParseCoord(currentPos[1], 'moto_marker_lng')
            ]}
            icon={MotoristaIcon}
        >
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
