import React, { useState, useEffect, useCallback } from 'react';
import { getForfaits, createForfait, updateForfait, deleteForfait } from '../../services/ForfaitService';

const ForfaitManager = () => {
    const [forfaits, setForfaits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentForfait, setCurrentForfait] = useState({
        id: null,
        nombre: '',
        descripcion: '',
        precio: '',
        viajes_incluidos: '',
        dias_validez: '',
        estado: 'activo'
    });

    const fetchForfaits = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getForfaits();
            setForfaits(response.data.data); // Laravel wraps paginated or resource collections in a 'data' object
            setError(null);
        } catch (err) {
            setError('No se pudieron cargar los forfaits. ¿El servidor está funcionando?');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchForfaits();
    }, [fetchForfaits]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentForfait(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentForfait({
            id: null,
            nombre: '',
            descripcion: '',
            precio: '',
            viajes_incluidos: '',
            dias_validez: '',
            estado: 'activo'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentForfait.nombre || !currentForfait.precio || !currentForfait.viajes_incluidos) {
            setError('Nombre, precio y viajes incluidos son campos obligatorios.');
            return;
        }

        const action = isEditing
            ? updateForfait(currentForfait.id, currentForfait)
            : createForfait(currentForfait);

        try {
            await action;
            await fetchForfaits();
            resetForm();
        } catch (err) {
            setError(`Error al ${isEditing ? 'actualizar' : 'crear'} el forfait.`);
            console.error(err);
        }
    };

    const handleEdit = (forfait) => {
        setIsEditing(true);
        setCurrentForfait(forfait);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este forfait?')) {
            try {
                await deleteForfait(id);
                await fetchForfaits();
            } catch (err) {
                setError('Error al eliminar el forfait.');
                console.error(err);
            }
        }
    };

    // Basic styling
    const styles = {
        container: { fontFamily: 'Arial, sans-serif', padding: '20px' },
        form: { marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' },
        input: { display: 'block', width: '100%', padding: '8px', margin: '10px 0', boxSizing: 'border-box' },
        button: { padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', background: '#007bff', color: 'white' },
        cancelButton: { marginLeft: '10px', background: '#6c757d' },
        table: { width: '100%', borderCollapse: 'collapse' },
        th: { background: '#f2f2f2', padding: '12px', border: '1px solid #ddd', textAlign: 'left' },
        td: { padding: '8px', border: '1px solid #ddd' },
        actionButton: { marginRight: '5px', padding: '5px 10px' }
    };

    if (loading) return <div>Cargando forfaits...</div>;

    return (
        <div style={styles.container}>
            <h2>Gestión de Forfaits</h2>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <h3>{isEditing ? 'Editar Forfait' : 'Crear Nuevo Forfait'}</h3>
                <input type="text" name="nombre" value={currentForfait.nombre} onChange={handleInputChange} placeholder="Nombre del forfait" style={styles.input} />
                <textarea name="descripcion" value={currentForfait.descripcion} onChange={handleInputChange} placeholder="Descripción" style={styles.input} />
                <input type="number" name="precio" value={currentForfait.precio} onChange={handleInputChange} placeholder="Precio" style={styles.input} />
                <input type="number" name="viajes_incluidos" value={currentForfait.viajes_incluidos} onChange={handleInputChange} placeholder="Viajes Incluidos" style={styles.input} />
                <input type="number" name="dias_validez" value={currentForfait.dias_validez} onChange={handleInputChange} placeholder="Días de Validez" style={styles.input} />
                <select name="estado" value={currentForfait.estado} onChange={handleInputChange} style={styles.input}>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                </select>
                <button type="submit" style={styles.button}>{isEditing ? 'Actualizar' : 'Crear'}</button>
                {isEditing && <button type="button" onClick={resetForm} style={{ ...styles.button, ...styles.cancelButton }}>Cancelar</button>}
            </form>

            <h3>Lista de Forfaits</h3>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Nombre</th>
                        <th style={styles.th}>Precio</th>
                        <th style
={styles.th}>Viajes</th>
                        <th style={styles.th}>Validez (días)</th>
                        <th style={styles.th}>Estado</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {forfaits.length > 0 ? forfaits.map(forfait => (
                        <tr key={forfait.id}>
                            <td style={styles.td}>{forfait.nombre}</td>
                            <td style={styles.td}>{forfait.precio}</td>
                            <td style={styles.td}>{forfait.viajes_incluidos}</td>
                            <td style={styles.td}>{forfait.dias_validez}</td>
                            <td style={styles.td}>{forfait.estado}</td>
                            <td style={styles.td}>
                                <button onClick={() => handleEdit(forfait)} style={{...styles.button, ...styles.actionButton}}>Editar</button>
                                <button onClick={() => handleDelete(forfait.id)} style={{...styles.button, ...styles.actionButton, background: '#dc3545'}}>Eliminar</button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No hay forfaits para mostrar.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ForfaitManager;
