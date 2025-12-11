// MotoTX Color System - Paleta de Colores Global
// Basada en psicología del color para transporte: Confianza (Azul), Seguridad (Verde), Energía (Amarillo)

export const colors = {
    // Colores Primarios
    primary: {
        main: '#2563eb',      // Azul - Confianza y profesionalismo
        light: '#3b82f6',
        dark: '#1d4ed8',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    },

    // Colores Secundarios
    secondary: {
        main: '#10b981',      // Verde - Seguridad y éxito
        light: '#34d399',
        dark: '#059669',
        gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)'
    },

    // Color de Acento
    accent: {
        main: '#f59e0b',      // Amarillo/Naranja - Energía y velocidad
        light: '#fbbf24',
        dark: '#d97706',
        gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
    },

    // Neutrales
    neutral: {
        white: '#ffffff',
        gray50: '#f9fafb',
        gray100: '#f3f4f6',
        gray200: '#e5e7eb',
        gray300: '#d1d5db',
        gray400: '#9ca3af',
        gray500: '#6b7280',
        gray600: '#4b5563',
        gray700: '#374151',
        gray800: '#1f2937',
        gray900: '#111827',
        black: '#000000'
    },

    // Estados
    status: {
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
    }
};

// Gradientes especiales para hero sections
export const gradients = {
    hero: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #f59e0b 100%)',
    card: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
    overlay: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 100%)'
};

export default colors;
