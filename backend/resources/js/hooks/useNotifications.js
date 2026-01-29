import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * useNotifications Hook
 *
 * [ES] Hook personalizado para gestionar conexiones WebSocket en tiempo real.
 *      Maneja los canales de escucha para solicitudes de viajes (Motoristas) y actualizaciones de estado (Clientes/Motoristas).
 *
 * [FR] Hook personnalisé pour gérer les connexions WebSocket en temps réel.
 *      Gère les canaux d'écoute pour les demandes de voyage (Chauffeurs) et les mises à jour de statut (Clients/Chauffeurs).
 *
 * @param {Function} onNewTrip [ES] Callback para nuevas solicitudes de viaje. [FR] Callback pour les nouvelles demandes de voyage.
 * @param {Function} onTripUpdate [ES] Callback para cambios de estado del viaje. [FR] Callback pour les changements de statut du voyage.
 */
const useNotifications = (onNewTrip, onTripUpdate) => {
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        // [ES] Función de limpieza para salir de los canales al desmontar
        // [FR] Fonction de nettoyage pour quitter les canaux lors du démontage
        return () => {
            if (window.Echo) {
                if (user.rol === 'motorista') {
                    window.Echo.leave('viajes.disponibles');
                }
                // [ES] Podríamos necesitar rastrear qué canales de viajes nos unimos para salir correctamente
                // [FR] Nous pourrions avoir besoin de suivre les canaux de voyage auxquels nous nous sommes joints pour quitter correctement
            }
        };
    }, [user]);

    // [ES] Los oyentes específicos por rol se manejan mejor en componentes específicos
    // [FR] Les écouteurs spécifiques au rôle sont mieux gérés dans des composants spécifiques
    // [ES] Este hook proporciona métodos auxiliares para unirse/salir de canales
    // [FR] Ce hook fournit des méthodes auxiliaires pour rejoindre/quitter les canaux

    /**
     * [ES] Escucha el canal público para nuevas solicitudes de viajes.
     * [FR] Écoute le canal public pour les nouvelles demandes de voyage.
     */
    const listenToAvailableTrips = (callback) => {
        if (user?.rol === 'motorista' && window.Echo) {
            // [ES] Cambiado al canal público 'drivers' coincidiendo con el backend
            // [FR] Changé au canal public 'drivers' correspondant au backend
            window.Echo.channel('drivers')
                .listen('ViajeSolicitado', (e) => {
                    if (callback) callback(e.viaje);
                });
        }
    };

    /**
     * [ES] Escucha actualizaciones privadas de un viaje específico.
     * [FR] Écoute les mises à jour privées d'un voyage spécifique.
     */
    const listenToTripUpdates = (viajeId, callback) => {
        if (viajeId && window.Echo) {
            const channel = window.Echo.private(`viaje.${viajeId}`);

            channel.listen('ViajeActualizado', (e) => {
                if (callback) callback(e.viaje);
            })
                .listen('ViajeAceptado', (e) => {
                    if (callback) callback(e.viaje);
                })
                .listen('.location-updated', (e) => { // Note the dot prefix for broadcastAs aliases
                    if (callback.onLocationUpdate) callback.onLocationUpdate(e);
                    // Also support generic callback if it handles the object structure
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
