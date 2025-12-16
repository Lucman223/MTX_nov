import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
const ClienteProfile = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ name: '', email: '', telefono: '' });
    const [forfaits, setForfaits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const colors = {
        primary: '#2563eb',
        primaryHover: '#1d4ed8',
        secondary: '#10b981',
        background: '#f3f4f6',
        cardBg: '#ffffff',
        text: '#111827',
        subtext: '#6b7280',
        border: '#e5e7eb',
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
            const activeForfaits = userData.cliente_forfaits || userData.clienteForfaits || [];
            setForfaits(activeForfaits);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al cargar datos');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put('/api/auth/profile', formData);
            toast.success('Perfil actualizado');
        } catch (error) {
            toast.error('Error al actualizar');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: colors.background, fontFamily: "'Inter', sans-serif" }}>
            {/* Header with Gradient */}
            <div style={{
                background: `linear-gradient(to right, ${colors.primary}, ${colors.primaryHover})`,
                color: 'white',
                padding: '2rem',
                borderBottom: '4px solid rgba(255,255,255,0.2)'
            }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            padding: '0.75rem',
                            borderRadius: '50%',
                            fontSize: '2rem',
                            width: '4rem',
                            height: '4rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            👤
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                Mi Perfil
                            </h1>
                            <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>Gestiona tu cuenta y forfaits</p>
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={() => navigate('/cliente')}
                            style={{
                                padding: '0.6rem 1.25rem',
                                backgroundColor: 'white',
                                color: colors.primary,
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                transition: 'transform 0.1s'
                            }}
                        >
                            ← Dashboard
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main style={{ maxWidth: '1000px', margin: '-2rem auto 2rem', padding: '0 1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>

                {/* Personal Info */}
                <div style={{
                    backgroundColor: colors.cardBg,
                    borderRadius: '1rem',
                    padding: '2rem',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: colors.text }}>
                        Información Personal
                    </h2>

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '700', color: colors.subtext, marginBottom: '0.5rem' }}>Nombre</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: `1px solid ${colors.border}`,
                                    backgroundColor: '#f9fafb'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '700', color: colors.subtext, marginBottom: '0.5rem' }}>Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: `1px solid ${colors.border}`,
                                    backgroundColor: '#f9fafb'
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
                                    backgroundColor: '#f9fafb'
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
                                opacity: saving ? 0.7 : 1
                            }}
                        >
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </form>

                    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '1rem', color: colors.error, marginBottom: '0.5rem' }}>Zona de Peligro</h3>
                        <button
                            onClick={() => {
                                if (window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
                                    // Simulación de borrado o llamada al endpoint
                                    toast.error('Por favor contacta a soporte@mototx.ml para eliminar tu cuenta permanentemente por seguridad.');
                                }
                            }}
                            type="button"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: `1px solid ${colors.error}`,
                                backgroundColor: '#fef2f2',
                                color: colors.error,
                                borderRadius: '0.5rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Eliminar Cuenta
                        </button>
                    </div>
                </div>

                {/* Forfaits Section */}
                <div style={{
                    backgroundColor: colors.cardBg,
                    borderRadius: '1rem',
                    padding: '2rem',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    height: 'fit-content'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.text }}>
                            💳 Mis Forfaits
                        </h2>
                        <button
                            onClick={() => navigate('/cliente/forfaits')}
                            style={{
                                fontSize: '0.85rem',
                                color: colors.primary,
                                fontWeight: '600',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            Comprar Más
                        </button>
                    </div>

                    {forfaits.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', border: '2px dashed #e5e7eb', borderRadius: '1rem', color: colors.subtext }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎫</div>
                            No tienes forfaits activos.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {forfaits.map((ff, index) => (
                                <div key={index} style={{
                                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryHover})`,
                                    padding: '1.5rem',
                                    borderRadius: '1rem',
                                    color: 'white',
                                    boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ position: 'relative', zIndex: 1 }}>
                                        <div style={{ fontSize: '0.75rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Forfait Activo</div>
                                        <div style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0.5rem 0' }}>
                                            {ff.viajes_restantes}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                                            Viajes restantes
                                        </div>
                                        <div style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.8, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '0.5rem' }}>
                                            Vence el: {new Date(ff.fecha_expiracion).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        right: '-1rem',
                                        bottom: '-1rem',
                                        opacity: 0.1,
                                        fontSize: '8rem',
                                        transform: 'rotate(-20deg)'
                                    }}>
                                        🏍️
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Purchase History */}
                <div style={{
                    backgroundColor: colors.cardBg,
                    borderRadius: '1rem',
                    padding: '2rem',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    gridColumn: '1 / -1' // Span full width
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: colors.text }}>
                        📜 Historial de Compras
                    </h2>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ borderBottom: `2px solid ${colors.border}`, textAlign: 'left' }}>
                                    <th style={{ padding: '1rem', color: colors.subtext }}>Fecha</th>
                                    <th style={{ padding: '1rem', color: colors.subtext }}>Plan</th>
                                    <th style={{ padding: '1rem', color: colors.subtext }}>Precio</th>
                                    <th style={{ padding: '1rem', color: colors.subtext }}>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {forfaits.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: colors.subtext }}>
                                            No hay historial disponible.
                                        </td>
                                    </tr>
                                ) : (
                                    forfaits.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((item, index) => (
                                        <tr key={index} style={{ borderBottom: `1px solid ${colors.border}` }}>
                                            <td style={{ padding: '1rem', color: colors.text }}>
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '1rem', fontWeight: '500', color: colors.text }}>
                                                {item.forfait?.nombre || 'Plan Estándar'}
                                            </td>
                                            <td style={{ padding: '1rem', color: colors.text }}>
                                                {item.forfait?.precio ? `${item.forfait.precio.toLocaleString()} CFA` : '-'}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    backgroundColor: item.estado === 'activo' ? '#dcfce7' : '#f3f4f6',
                                                    color: item.estado === 'activo' ? '#166534' : '#4b5563'
                                                }}>
                                                    {item.estado ? item.estado.toUpperCase() : 'N/A'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main >
        </div >
    );
};

export default ClienteProfile;
