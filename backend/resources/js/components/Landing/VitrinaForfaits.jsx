import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const VitrinaForfaits = ({ colors }) => {
    const { t } = useTranslation();
    const [forfaits, setForfaits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPublicForfaits = async () => {
            try {
                const response = await axios.get('/api/forfaits/public');
                setForfaits(response.data);
            } catch (error) {
                // Keep empty if error
            } finally {
                setLoading(false);
            }
        };
        fetchPublicForfaits();
    }, []);

    if (loading) return null;
    if (!Array.isArray(forfaits) || forfaits.length === 0) return null;

    return (
        <section id="vitrina" style={{ padding: '5rem 2rem', background: '#f3f4f6' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h3 style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    color: '#1f2937'
                }}>
                    {t('client_forfaits.title')}
                </h3>
                <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '3rem', fontSize: '1.125rem' }}>
                    {t('client_forfaits.subtitle')}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    {Array.isArray(forfaits) && forfaits.map((forfait) => (
                        <div key={forfait.id} className="mtx-card" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            padding: '2rem',
                            border: forfait.id === 2 ? `2px solid ${colors.primary}` : '1px solid #e5e7eb',
                            position: 'relative'
                        }}>
                            {forfait.id === 2 && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-12px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: colors.primary,
                                    color: 'white',
                                    padding: '0.25rem 1rem',
                                    borderRadius: '1rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold'
                                }}>
                                    {t('client_forfaits.selected')}
                                </div>
                            )}
                            <div>
                                <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: colors.primary }}>
                                    {forfait.nombre}
                                </h4>
                                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#111827', marginBottom: '1rem' }}>
                                    {parseInt(forfait.precio).toLocaleString()} <span style={{ fontSize: '1rem', color: '#6b7280' }}>CFA</span>
                                </div>
                                <p style={{ color: '#4b5563', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                    {forfait.descripcion}
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                                    <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6', color: '#6b7280' }}>
                                        ✅ {t('client_forfaits.trips_count', { count: forfait.viajes_incluidos })}
                                    </li>
                                    <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6', color: '#6b7280' }}>
                                        ✅ {forfait.dias_validez} {t('driver_dashboard.days')}
                                    </li>
                                    <li style={{ padding: '0.5rem 0', color: '#6b7280' }}>
                                        ✅ {t('landing.safety_guaranteed')}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default VitrinaForfaits;
