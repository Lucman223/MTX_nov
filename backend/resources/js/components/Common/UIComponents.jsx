
import React from 'react';

/**
 * [ES] Componente de tarjeta base con estilos unificados.
 * [FR] Composant de carte de base avec des styles unifiés.
 */
export const Card = ({ children, className = '', accent = false, ...props }) => (
    <div
        className={`mtx-card ${accent ? 'mtx-card-accent' : ''} ${className}`}
        {...props}
    >
        {children}
    </div>
);

/**
 * [ES] Botón estandarizado con variantes de diseño.
 * [FR] Bouton standardisé avec des variantes de design.
 */
export const Button = ({
    children,
    variant = 'primary',
    className = '',
    icon,
    label, // Para Accesibilidad (aria-label)
    ...props
}) => (
    <button
        className={`mtx-button mtx-button-${variant} ${className}`}
        aria-label={label}
        {...props}
    >
        {icon && <span className="mtx-button-icon">{icon}</span>}
        {children}
    </button>
);

/**
 * [ES] Badge de estado o contador.
 * [FR] Badge de statut ou compteur.
 */
export const Badge = ({ children, variant = 'premium', className = '', ...props }) => (
    <div className={`mtx-badge mtx-badge-${variant} ${className}`} {...props}>
        {children}
    </div>
);

/**
 * [ES] Modal emergente básico.
 * [FR] Modale contextuelle de base.
 */
export const Modal = ({ children, isOpen, onClose, title }) => {
    if (!isOpen) return null;
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', width: '90%', maxWidth: '400px', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
                {children}
            </div>
        </div>
    );
};
