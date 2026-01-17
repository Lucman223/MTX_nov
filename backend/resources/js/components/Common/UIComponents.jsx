
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
