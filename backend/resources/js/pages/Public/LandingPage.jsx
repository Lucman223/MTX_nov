import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    // Sistema de colores cohesivo
    const colors = {
        primary: '#2563eb',    // Azul - Confianza
        secondary: '#10b981',  // Verde - Seguridad
        accent: '#f59e0b',     // Amarillo - Energía
    };

    const features = [
        {
            icon: '🚀',
            title: 'Rápido y Confiable',
            description: 'Encuentra tu moto en minutos y llega a tu destino sin demoras',
            color: colors.primary,
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        },
        {
            icon: '💰',
            title: 'Forfaits Económicos',
            description: 'Paquetes prepagados que se ajustan a tu presupuesto',
            color: colors.secondary,
            gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)'
        },
        {
            icon: '📍',
            title: 'Tracking en Tiempo Real',
            description: 'Sigue la ubicación de tu motorista en el mapa',
            color: colors.accent,
            gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
        }
    ];

    const roles = [
        {
            title: 'Cliente',
            subtitle: 'Solicita Viajes',
            icon: '👤',
            color: colors.primary,
            hoverColor: '#1d4ed8',
            steps: [
                'Compra un forfait',
                'Solicita tu viaje en el mapa',
                'Sigue tu moto en tiempo real'
            ],
            action: () => navigate('/register?rol=cliente')
        },
        {
            title: 'Motorista',
            subtitle: 'Gana Dinero',
            icon: '🏍️',
            color: colors.secondary,
            hoverColor: '#059669',
            steps: [
                'Regístrate y obtén aprobación',
                'Recibe solicitudes de viaje',
                'Gana dinero transportando'
            ],
            action: () => navigate('/register?rol=motorista')
        }
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#ffffff' }}>
            {/* Header */}
            <header style={{
                padding: '1.5rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                position: 'sticky',
                top: 0,
                zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '2rem' }}>🏍️</span>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.primary, margin: 0 }}>MotoTX</h1>
                </div>
                <button
                    onClick={() => navigate('/login')}
                    style={{
                        padding: '0.5rem 1.5rem',
                        background: colors.primary,
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 8px rgba(37, 99, 235, 0.3)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 4px rgba(37, 99, 235, 0.2)';
                    }}
                >
                    Iniciar Sesión
                </button>
            </header>

            {/* Hero Section */}
            <section style={{
                padding: '5rem 2rem',
                textAlign: 'center',
                background: `linear-gradient(135deg, ${colors.primary} 0%, #7c3aed 50%, ${colors.accent} 100%)`,
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{
                        fontSize: '3.5rem',
                        fontWeight: 'bold',
                        marginBottom: '1rem',
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                        lineHeight: 1.2
                    }}>
                        Tu Solución de Transporte<br />en Bamako
                    </h2>
                    <p style={{
                        fontSize: '1.25rem',
                        marginBottom: '2.5rem',
                        opacity: 0.95,
                        maxWidth: '700px',
                        margin: '0 auto 2.5rem',
                        textShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }}>
                        Conectamos clientes con motoristas de confianza.<br />
                        Viajes rápidos, seguros y económicos.
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        style={{
                            padding: '1.25rem 3.5rem',
                            fontSize: '1.25rem',
                            background: 'white',
                            color: colors.primary,
                            border: 'none',
                            borderRadius: '0.75rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                            transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-5px) scale(1.05)';
                            e.target.style.boxShadow = '0 15px 35px rgba(0,0,0,0.4)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0) scale(1)';
                            e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
                        }}
                    >
                        Comenzar Ahora →
                    </button>
                </div>
            </section>

            {/* Features Section - MÁS LLAMATIVAS */}
            <section style={{ padding: '5rem 2rem', background: '#f9fafb' }}>
                <h3 style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    color: '#1f2937',
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    ¿Por qué elegir MotoTX?
                </h3>
                <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '3rem', fontSize: '1.125rem' }}>
                    La mejor experiencia de transporte en Bamako
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            style={{
                                padding: '2.5rem',
                                background: 'white',
                                borderRadius: '1.5rem',
                                textAlign: 'center',
                                transition: 'all 0.3s',
                                cursor: 'pointer',
                                border: '2px solid transparent',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-15px) scale(1.03)';
                                e.currentTarget.style.boxShadow = `0 20px 40px ${feature.color}40`;
                                e.currentTarget.style.borderColor = feature.color;
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
                                e.currentTarget.style.borderColor = 'transparent';
                            }}
                        >
                            {/* Gradiente de fondo sutil */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '5px',
                                background: feature.gradient
                            }}></div>

                            <div style={{
                                fontSize: '4rem',
                                marginBottom: '1.5rem',
                                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                            }}>
                                {feature.icon}
                            </div>
                            <h4 style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                marginBottom: '1rem',
                                color: feature.color
                            }}>
                                {feature.title}
                            </h4>
                            <p style={{ color: '#6b7280', fontSize: '1.05rem', lineHeight: 1.6 }}>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works - Roles Section */}
            <section style={{ padding: '5rem 2rem', background: 'white' }}>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem', color: '#1f2937' }}>
                    Únete a MotoTX
                </h3>
                <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '3rem', fontSize: '1.125rem' }}>
                    Elige tu rol y comienza hoy mismo
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', maxWidth: '900px', margin: '0 auto' }}>
                    {roles.map((role, index) => (
                        <div
                            key={index}
                            style={{
                                background: 'white',
                                borderRadius: '1.5rem',
                                overflow: 'hidden',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                                transition: 'all 0.3s',
                                border: '1px solid #e5e7eb'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = `0 20px 40px ${role.color}30`;
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)';
                            }}
                        >
                            <div style={{ padding: '2.5rem', background: role.color, color: 'white', textAlign: 'center' }}>
                                <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>{role.icon}</div>
                                <h4 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{role.title}</h4>
                                <p style={{ opacity: 0.95, fontSize: '1.05rem' }}>{role.subtitle}</p>
                            </div>
                            <div style={{ padding: '2rem' }}>
                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0' }}>
                                    {role.steps.map((step, i) => (
                                        <li key={i} style={{
                                            padding: '0.75rem 0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            color: '#4b5563',
                                            fontSize: '1.05rem'
                                        }}>
                                            <span style={{
                                                color: role.color,
                                                fontWeight: 'bold',
                                                fontSize: '1.25rem'
                                            }}>✓</span>
                                            {step}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={role.action}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        background: role.color,
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.75rem',
                                        fontWeight: 'bold',
                                        fontSize: '1.05rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: `0 4px 12px ${role.color}40`
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.background = role.hoverColor;
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = `0 6px 16px ${role.color}50`;
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.background = role.color;
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = `0 4px 12px ${role.color}40`;
                                    }}
                                >
                                    Registrarse como {role.title}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '3rem 2rem', background: '#1f2937', color: 'white', textAlign: 'center' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '2rem' }}>🏍️</span>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>MotoTX</h2>
                        </div>
                        <p style={{ opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
                            Plataforma de Gestión de Forfaits para Mototaxi en Bamako
                        </p>
                    </div>
                    <div style={{
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        paddingTop: '2rem',
                        opacity: 0.7,
                        fontSize: '0.9rem'
                    }}>
                        <p style={{ margin: 0 }}>
                            © 2025 MotoTX - Desarrollado con ❤️ para mejorar el transporte en Mali
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
