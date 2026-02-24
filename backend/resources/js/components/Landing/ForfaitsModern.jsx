import React from 'react';
import { Check, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForfaitsModern = () => {
    const navigate = useNavigate();
    const plans = [
        {
            name: "Básico",
            price: "5,000",
            trips: 5,
            days: 7,
            popular: false,
            color: "blue"
        },
        {
            name: "Premium",
            price: "15,000",
            trips: 20,
            days: 30,
            popular: true,
            color: "blue"
        },
        {
            name: "Empresarial",
            price: "50,000",
            trips: 75,
            days: 30,
            popular: false,
            color: "blue"
        }
    ];

    return (
        <section className="py-24 bg-gray-50" id="forfaits">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl font-black text-gray-900 mb-6">Planes que se adaptan a ti</h2>
                    <p className="text-gray-600 text-lg">Ahorra hasta un 25% en tus recorridos diarios activando uno de nuestros paquetes prepago.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <div key={i} className={`relative flex flex-col p-8 rounded-[2.5rem] bg-white border-2 transition-all hover:scale-105 ${plan.popular ? 'border-blue-600 shadow-2xl shadow-blue-100 scale-105 z-10' : 'border-gray-100 shadow-sm'}`}>
                            {plan.popular && (
                                <div className="absolute top-0 right-10 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                    <Zap className="w-3 h-3 fill-current" /> EL MAS ELEGIDO
                                </div>
                            )}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                                    <span className="text-gray-500 font-bold uppercase text-xs">CFA</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-gray-600">
                                    <div className="p-1 bg-blue-100 rounded-full text-blue-600"><Check className="w-4 h-4" /></div>
                                    <span><strong>{plan.trips}</strong> Viajes incluidos</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-600">
                                    <div className="p-1 bg-blue-100 rounded-full text-blue-600"><Check className="w-4 h-4" /></div>
                                    <span>Válido por <strong>{plan.days}</strong> días</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-600">
                                    <div className="p-1 bg-blue-100 rounded-full text-blue-600"><Check className="w-4 h-4" /></div>
                                    <span>Prioridad de asignación</span>
                                </li>
                            </ul>

                            <button
                                onClick={() => navigate('/login')}
                                className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 ${plan.popular ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                            >
                                Activar Plan
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ForfaitsModern;
