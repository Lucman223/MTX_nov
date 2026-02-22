import React from 'react';
import { CheckCircle2, Clock, MapPin, Navigation, Flag } from 'lucide-react';
import '../../../css/components.css';

/**
 * TripPhaseTracker Component
 * 
 * [ES] Visualizador de fases del viaje con iconos y estados dinámicos.
 * [FR] Visualiseur des phases du trajet avec des icônes et des états dynamiques.
 */
const TripPhaseTracker = ({ estado }) => {
    const phases = [
        { key: 'solicitado', label: 'Buscando', icon: <Clock />, description: 'Pedido enviado' },
        { key: 'aceptado', label: 'En camino', icon: <Navigation />, description: 'Conductor asignado' },
        { key: 'en_curso', label: 'En viaje', icon: <MapPin />, description: 'Rumbo al destino' },
        { key: 'completado', label: 'Llegamos', icon: <Flag />, description: 'Fin del trayecto' }
    ];

    const getPhaseIndex = (currentEstado) => {
        const indexMap = {
            'solicitado': 0,
            'aceptado': 1,
            'en_curso': 2,
            'completado': 3
        };
        return indexMap[currentEstado] ?? -1;
    };

    const currentIndex = getPhaseIndex(estado);

    if (estado === 'cancelado') {
        return (
            <div className="trip-tracker-cancelled">
                <span className="text-error">✕ Viaje Cancelado</span>
            </div>
        );
    }

    return (
        <div className="trip-tracker-container">
            <div className="trip-tracker-line">
                <div
                    className="trip-tracker-progress"
                    style={{ width: `${(currentIndex / (phases.length - 1)) * 100}%` }}
                ></div>
            </div>

            <div className="trip-tracker-steps">
                {phases.map((phase, index) => {
                    const isCompleted = index < currentIndex;
                    const isActive = index === currentIndex;

                    return (
                        <div key={phase.key} className={`tracker-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                            <div className="tracker-icon-wrapper">
                                {isCompleted ? <CheckCircle2 size={24} /> : React.cloneElement(phase.icon, { size: 24 })}
                                {isActive && <div className="pulse-aura"></div>}
                            </div>
                            <div className="tracker-text-wrapper">
                                <span className="tracker-label">{phase.label}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .trip-tracker-container {
                    padding: 2.5rem 1rem;
                    position: relative;
                    background: #ffffff;
                    border-radius: 1rem;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
                }
                .trip-tracker-line {
                    position: absolute;
                    top: 3.75rem;
                    left: 3rem;
                    right: 3rem;
                    height: 6px;
                    background: #f1f5f9;
                    z-index: 1;
                    border-radius: 10px;
                    overflow: hidden;
                }
                .trip-tracker-progress {
                    height: 100%;
                    background: linear-gradient(90deg, #10b981 0%, #3b82f6 100%);
                    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
                }
                .trip-tracker-steps {
                    display: flex;
                    justify-content: space-between;
                    position: relative;
                    z-index: 2;
                }
                .tracker-step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 25%;
                    transition: all 0.3s ease;
                }
                .tracker-icon-wrapper {
                    position: relative;
                    width: 3.5rem;
                    height: 3.5rem;
                    border-radius: 1.25rem;
                    background: white;
                    border: 2px solid #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 0.75rem;
                    color: #cbd5e1;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }
                .tracker-step.completed .tracker-icon-wrapper {
                    background: #10b981;
                    border-color: #10b981;
                    color: white;
                    transform: translateY(-2px);
                }
                .tracker-step.active .tracker-icon-wrapper {
                    background: white;
                    border-color: #3b82f6;
                    color: #3b82f6;
                    transform: scale(1.15) translateY(-5px);
                    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2);
                }
                .pulse-aura {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    border-radius: 1.25rem;
                    border: 2px solid #3b82f6;
                    animation: mtx-pulse 2s infinite;
                    z-index: -1;
                }
                @keyframes mtx-pulse {
                    0% { transform: scale(1); opacity: 0.8; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
                .tracker-label {
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.025em;
                }
                .tracker-step.active .tracker-label {
                    color: #3b82f6;
                }
                .tracker-step.completed .tracker-label {
                    color: #10b981;
                }
                .trip-tracker-cancelled {
                    padding: 1.5rem;
                    background: #fff1f2;
                    border: 1px solid #fecdd3;
                    border-radius: 1rem;
                    text-align: center;
                    font-weight: bold;
                    color: #be123c;
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }
            `}} />
        </div>
    );
};

export default TripPhaseTracker;
