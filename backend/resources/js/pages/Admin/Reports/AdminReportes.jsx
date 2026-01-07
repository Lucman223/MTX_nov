import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * AdminReportes Component
 *
 * [ES] Panel de estadísticas y análisis del sistema (En construcción).
 *      Destinado a mostrar informes de ingresos, eficiencia y métricas de usuario para la toma de decisiones.
 *
 * [FR] Panneau de statistiques et d'analyse du système (En construction).
 *      Destiné à afficher des rapports de revenus, d'efficacité et des mesures d'utilisateurs pour la prise de décision.
 */
const AdminReportes = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>📊 Reportes y Análisis</h1>
                    <button
                        onClick={() => navigate('/admin')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            backgroundColor: 'white',
                            color: '#374151',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Volver
                    </button>
                </div>

                <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚧</div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>
                        Sección en Construcción
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
                        Estamos preparando informes detallados de ingresos, retención de usuarios y eficiencia de rutas.
                    </p>
                    <div style={{ marginTop: '2rem' }}>
                        <button
                            disabled
                            style={{
                                padding: '0.75rem 2rem',
                                backgroundColor: '#f3f4f6',
                                color: '#9ca3af',
                                borderRadius: '0.5rem',
                                border: 'none',
                                fontWeight: '600',
                                cursor: 'not-allowed'
                            }}
                        >
                            Descargar PDF (Próximamente)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReportes;
