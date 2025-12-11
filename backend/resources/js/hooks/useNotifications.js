import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const useNotifications = (onNewTrip, onTripUpdate) => {
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        // Cleanup function to leave channels when component unmounts or user changes
        return () => {
            if (window.Echo) {
                if (user.rol === 'motorista') {
                    window.Echo.leave('viajes.disponibles');
                }
                // We might need to track which trip channels we joined to leave them properly
                // For now, simpler approach is acceptable
            }
        };
    }, [user]);

    // Role-specific listeners are better handled in specific components or context
    // This hook can provide helper methods to join/leave channels

    const listenToAvailableTrips = (callback) => {
        if (user?.rol === 'motorista' && window.Echo) {
            console.log('Listening to viajes.disponibles');
            window.Echo.private('viajes.disponibles')
                .listen('ViajeSolicitado', (e) => {
                    console.log('New trip requested:', e.viaje);
                    if (callback) callback(e.viaje);
                });
        }
    };

    const listenToTripUpdates = (viajeId, callback) => {
        if (viajeId && window.Echo) {
            console.log(`Listening to viaje.${viajeId}`);
            window.Echo.private(`viaje.${viajeId}`)
                .listen('ViajeActualizado', (e) => {
                    console.log('Trip updated:', e.viaje);
                    if (callback) callback(e.viaje);
                });

            return () => {
                window.Echo.leave(`viaje.${viajeId}`);
            };
        }
        return () => { };
    };

    return {
        listenToAvailableTrips,
        listenToTripUpdates
    };
};

export default useNotifications;
