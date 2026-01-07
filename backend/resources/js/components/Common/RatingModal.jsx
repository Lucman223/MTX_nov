import React, { useState } from 'react';

/**
 * RatingModal Component
 *
 * [ES] Modal interactivo para calificar trayectos finalizados.
 *      Permite al cliente asignar una puntuación (1-5 estrellas) y dejar un comentario opcional sobre el conductor.
 *
 * [FR] Modal interactif pour noter les trajets terminés.
 *      Permet au client d'attribuer une note (1-5 étoiles) et de laisser un commentaire facultatif sur le chauffeur.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - [ES] Estado de visibilidad [FR] État de visibilité
 * @param {Function} props.onClose - [ES] Manejador de cierre [FR] Gestionnaire de fermeture
 * @param {Function} props.onSubmit - [ES] Envío de datos al API [FR] Envoi des données à l'API
 * @param {string} props.motoristaName - [ES] Nombre del conductor a calificar [FR] Nom du chauffeur à noter
 */
const RatingModal = ({ isOpen, onClose, onSubmit, motoristaName }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hover, setHover] = useState(0);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ rating, comment });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md m-4 transform transition-all scale-100">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Califica tu viaje</h2>
                    <p className="text-gray-500 mt-2">¿Cómo estuvo tu viaje con <span className="font-semibold text-blue-600">{motoristaName}</span>?</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center mb-6">
                        {[...Array(5)].map((star, index) => {
                            const ratingValue = index + 1;
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    className={`text-4xl focus:outline-none transition-colors duration-200 ${ratingValue <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
                                        }`}
                                    onClick={() => setRating(ratingValue)}
                                    onMouseEnter={() => setHover(ratingValue)}
                                    onMouseLeave={() => setHover(rating)}
                                >
                                    ★
                                </button>
                            );
                        })}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Comentario (Opcional)
                        </label>
                        <textarea
                            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
                            rows="4"
                            placeholder="Escribe aquí tu experiencia..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Omitir
                        </button>
                        <button
                            type="submit"
                            disabled={rating === 0}
                            className={`flex-1 py-3 px-4 font-semibold rounded-lg text-white transition-colors ${rating === 0
                                ? 'bg-blue-300 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 shadow-lg'
                                }`}
                        >
                            Enviar Calificación
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RatingModal;
