import { useAuth } from '../../context/AuthContext'; // Import useAuth
import { useNavigate } from 'react-router-dom';

const Forfaits = () => {
    const { refreshUser } = useAuth(); // Destructure refreshUser
    const [forfaits, setForfaits] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // ... (fetch useEffect)

    const handleBuy = async (forfaitId) => {
        if (!confirm('¿Estás seguro de que quieres comprar este forfait? (Simulación de pago)')) return;

        try {
            await axios.post('/api/forfaits/buy', { forfait_id: forfaitId });
            alert('¡Compra realizada con éxito!');
            await refreshUser(); // Update balance
            navigate('/cliente');
        } catch (error) {
            // ... (error handling)
            console.error('Error buying forfait:', error);
            alert('Error en la compra: ' + (error.response?.data?.message || 'Error desconocido'));
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Planes de Viajes (Forfaits)</h1>
            <button onClick={() => navigate('/cliente')} style={{ marginBottom: '2rem', padding: '0.5rem 1rem', background: '#e5e7eb', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
                ← Volver al Dashboard
            </button>

            {loading ? <p>Cargando planes...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {forfaits.map(plan => (
                        <div key={plan.id} style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '2rem', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>{plan.nombre}</h2>
                            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981', marginBottom: '1rem' }}>{plan.precio} CFA</p>
                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', color: '#6b7280' }}>
                                <li>✅ {plan.viajes_incluidos} Viajes</li>
                                <li>📅 Validez: {plan.dias_validez} días</li>
                            </ul>
                            <button
                                onClick={() => handleBuy(plan.id)}
                                style={{ width: '100%', padding: '0.75rem', background: '#2563eb', color: 'white', fontWeight: 'bold', borderRadius: '5px', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                            >
                                Comprar Ahora
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Forfaits;
