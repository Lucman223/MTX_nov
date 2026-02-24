import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const questions = [
        {
            q: "¿Cómo pido un viaje?",
            a: "Es muy fácil. Inicia sesión en tu cuenta, selecciona tu destino en el mapa y haz clic en 'Solicitar'. En pocos segundos te asignaremos el conductor más cercano."
        },
        {
            q: "¿Qué métodos de pago aceptan?",
            a: "Actualmente aceptamos pago en efectivo al finalizar el viaje. También puedes comprar 'Forfaits' (paquetes de viajes) mediante transferencia Orange Money o Moov Money para viajar sin preocuparte por el suelto."
        },
        {
            q: "¿Son seguros los trayectos?",
            a: "Absolutamente. Todos nuestros conductores cuentan con casco certificado para el pasajero, seguro de viaje y son rastreados vía GPS durante todo el recorrido."
        },
        {
            q: "¿Puedo cancelar un viaje solicitado?",
            a: "Sí, puedes cancelar el viaje sin coste alguno antes de que el conductor llegue a tu ubicación de origen."
        }
    ];

    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-gray-900">Preguntas Frecuentes</h2>
                    <p className="text-gray-600 mt-4 font-medium italic">Todo lo que necesitas saber sobre MotoTX</p>
                </div>

                <div className="space-y-4">
                    {questions.map((item, i) => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                                className="w-full px-8 py-6 text-left flex justify-between items-center transition-colors hover:bg-gray-50"
                            >
                                <span className="font-bold text-gray-900 text-lg">{item.q}</span>
                                {openIndex === i ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                            </button>
                            {openIndex === i && (
                                <div className="px-8 pb-6 animate-fadeIn">
                                    <p className="text-gray-600 leading-relaxed border-t border-gray-50 pt-4 italic">
                                        {item.a}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
