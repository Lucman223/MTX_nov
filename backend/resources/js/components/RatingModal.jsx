import React, { useState } from 'react';
import axios from 'axios';

const RatingModal = ({ tripId, motoristaName, onClose, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comentario, setComentario] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Color system
    const colors = {
        primary: '#2563eb',
        accent: '#f59e0b',
        error: '#ef4444'
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            alert('Por favor selecciona una calificación');
            return;
        }

        setSubmitting(true);
        try {
            await axios.post(`/api/viajes/${tripId}/calificar`, {
                puntuacion: rating,
                comentario: comentario || null
            });

            alert('¡Calificación enviada con éxito!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error submitting rating:', error);
            const msg = error.response?.data?.error || 'Error al enviar la calificación';
            alert(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                maxWidth: '500px',
                width: '90%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
                    Calificar Viaje
                </h2>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                    ¿Cómo fue tu experiencia con <strong>{motoristaName}</strong>?
                </p>

                {/* Star Rating */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                style={{
                                    cursor: 'pointer',
                                    color: (hoverRating || rating) >= star ? colors.accent : '#d1d5db',
                                    transition: 'all 0.2s',
                                    transform: (hoverRating || rating) >= star ? 'scale(1.1)' : 'scale(1)',
                                    filter: (hoverRating || rating) >= star ? 'drop-shadow(0 4px 8px rgba(245, 158, 11, 0.4))' : 'none'
                                }}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <div style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                        {rating === 0 && 'Selecciona una calificación'}
                        {rating === 1 && 'Muy malo'}
                        {rating === 2 && 'Malo'}
                        {rating === 3 && 'Regular'}
                        {rating === 4 && 'Bueno'}
                        {rating === 5 && 'Excelente'}
                    </div>
                </div>

                {/* Comment */}
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                        Comentario (opcional)
                    </label>
                    <textarea
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        placeholder="Cuéntanos más sobre tu experiencia..."
                        maxLength={500}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                            resize: 'vertical',
                            minHeight: '100px',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = colors.accent}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                    <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                        {comentario.length}/500
                    </div>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        style={{
                            flex: 1,
                            padding: '0.875rem',
                            background: 'white',
                            color: '#6b7280',
                            border: '2px solid #e5e7eb',
                            borderRadius: '0.75rem',
                            fontWeight: '600',
                            cursor: submitting ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            if (!submitting) {
                                e.target.style.borderColor = '#9ca3af';
                                e.target.style.color = '#374151';
                            }
                        }}
                        onMouseOut={(e) => {
                            e.target.style.borderColor = '#e5e7eb';
                            e.target.style.color = '#6b7280';
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || rating === 0}
                        style={{
                            flex: 1,
                            padding: '0.875rem',
                            background: (submitting || rating === 0) ? '#d1d5db' : colors.accent,
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.75rem',
                            fontWeight: 'bold',
                            cursor: (submitting || rating === 0) ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: (submitting || rating === 0) ? 'none' : `0 4px 12px ${colors.accent}40`
                        }}
                        onMouseOver={(e) => {
                            if (!submitting && rating > 0) {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = `0 6px 16px ${colors.accent}50`;
                            }
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = (submitting || rating === 0) ? 'none' : `0 4px 12px ${colors.accent}40`;
                        }}
                    >
                        {submitting ? 'Enviando...' : 'Enviar Calificación'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RatingModal;
