import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Type, Check } from 'lucide-react';

const AccessibilityToggle = () => {
    const { isDyslexic, toggleDyslexic } = useAccessibility();

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
        }}>
            <button
                onClick={toggleDyslexic}
                title="Modo Dislexia (OpenDyslexic)"
                style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '25px',
                    backgroundColor: isDyslexic ? '#2563eb' : 'white',
                    color: isDyslexic ? 'white' : '#1f2937',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                }}
            >
                <Type size={24} />
                {isDyslexic && (
                    <div style={{
                        position: 'absolute',
                        top: '-2px',
                        right: '-2px',
                        background: '#10b981',
                        borderRadius: '50%',
                        padding: '2px'
                    }}>
                        <Check size={12} color="white" />
                    </div>
                )}
            </button>
        </div>
    );
};

export default AccessibilityToggle;
