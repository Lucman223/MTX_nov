import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const MotoristaProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Local state
    const [formData, setFormData] = useState({ name: '', email: '', telefono: '' });
    const [motoInfo, setMotoInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const colors = {
        primary: '#2563eb', // Blue-600
        primaryHover: '#1d4ed8', // Blue-700
        secondary: '#10b981', // Emerald-500
        secondaryHover: '#059669', // Emerald-600
        background: '#f3f4f6', // Gray-100
        cardBg: '#ffffff',
        text: '#111827', // Gray-900
        subtext: '#6b7280', // Gray-500
        border: '#e5e7eb', // Gray-200
        error: '#ef4444'
    };

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/auth/profile');
            const userData = response.data.user;
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                telefono: userData.telefono || ''
            });
            if (userData.motorista_perfil) {
                setMotoInfo(userData.motorista_perfil);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Error al cargar el perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put('/api/auth/profile', {
                name: formData.name,
                email: formData.email,
                telefono: formData.telefono
            });
            toast.success('Perfil actualizado correctamente');
        } catch (error) {
            toast.error('Error al actualizar');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: colors.background, fontFamily: "'Inter', sans-serif" }}>
            {/* Header */}
            <div style={{
                background: `linear-gradient(to right, ${colors.secondary}, ${colors.secondaryHover})`,
                color: 'white',
                padding: '2rem',
                borderBottom: `4px solid ${colors.primary}`
            }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            padding: '0.75rem',
                            borderRadius: '1rem',
                            fontSize: '2rem'
                        }}>
                            🛵
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                Perfil del Motorista
                            </h1>
                            <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>Gestiona tus datos y vehículo</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => navigate('/motorista')}
                            style={{
                                padding: '0.6rem 1.25rem',
                                backgroundColor: 'white',
                                color: colors.secondary,
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                transition: 'transform 0.1s'
                            }}
                        >
                            ← Volver al Dashboard
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main style={{ maxWidth: '1000px', margin: '-2rem auto 2rem', padding: '0 1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>

                {/* Personal Data Form */}
                <div style={{
                    backgroundColor: colors.cardBg,
                    borderRadius: '1rem',
                    padding: '2rem',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: colors.text, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        👤 Datos Personales
                    </h2>

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '700', color: colors.subtext, marginBottom: '0.5rem' }}>Nombre Completo</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: `1px solid ${colors.border}`,
                                    backgroundColor: '#f9fafb',
                                    fontSize: '0.95rem',
                                    color: colors.text
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '700', color: colors.subtext, marginBottom: '0.5rem' }}>Correo Electrónico</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: `1px solid ${colors.border}`,
                                    backgroundColor: '#f9fafb',
                                    fontSize: '0.95rem',
                                    color: colors.text
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '700', color: colors.subtext, marginBottom: '0.5rem' }}>Teléfono</label>
                            <input
                                type="text"
                                value={formData.telefono}
                                onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: `1px solid ${colors.border}`,
                                    backgroundColor: '#f9fafb',
                                    fontSize: '0.95rem',
                                    color: colors.text
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                marginTop: '1rem',
                                width: '100%',
                                padding: '0.875rem',
                                backgroundColor: colors.primary,
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                opacity: saving ? 0.7 : 1
                            }}
                        >
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </form>
                </div>

                {/* Vehicle Info */}
                <div style={{
                    backgroundColor: colors.cardBg,
                    borderRadius: '1rem',
                    padding: '2rem',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    height: 'fit-content'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: colors.text, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🏍️ Tu Vehículo
                    </h2>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', border: `1px solid ${colors.secondary}30` }}>
                            <span style={{ color: colors.subtext, fontWeight: '500' }}>Matrícula</span>
                            <span style={{ fontWeight: 'bold', fontFamily: 'monospace', fontSize: '1.1rem', color: colors.text }}>{motoInfo.matricula || '---'}</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ padding: '1rem', backgroundColor: colors.background, borderRadius: '0.5rem' }}>
                                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: colors.subtext, letterSpacing: '0.05em' }}>Modelo</div>
                                <div style={{ fontWeight: '600', fontSize: '1.1rem', marginTop: '0.25rem' }}>{motoInfo.modelo_moto || '---'}</div>
                            </div>
                            <div style={{ padding: '1rem', backgroundColor: colors.background, borderRadius: '0.5rem' }}>
                                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: colors.subtext, letterSpacing: '0.05em' }}>Año</div>
                                <div style={{ fontWeight: '600', fontSize: '1.1rem', marginTop: '0.25rem' }}>{motoInfo.anio_moto || '---'}</div>
                            </div>
                        </div>

                        <div style={{ padding: '1rem', backgroundColor: colors.background, borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: colors.subtext, letterSpacing: '0.05em' }}>Color</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontWeight: '600' }}>{motoInfo.color_moto || '---'}</span>
                                {motoInfo.color_moto && (
                                    <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', backgroundColor: motoInfo.color_moto, border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: colors.subtext, textAlign: 'center', fontStyle: 'italic' }}>
                        * Para modificar datos del vehículo, contacta con soporte.
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MotoristaProfile;
