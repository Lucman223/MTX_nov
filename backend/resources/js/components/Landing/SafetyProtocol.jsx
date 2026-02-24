import React from 'react';
import { ShieldCheck, Eye, Map, Smartphone } from 'lucide-react';

const SafetyProtocol = () => {
    const points = [
        {
            icon: <ShieldCheck className="w-12 h-12 text-emerald-500" />,
            title: "Conductores Certificados",
            desc: "Cada conductor pasa por un riguroso proceso de validación presencial, revisión de antecedentes y estado del vehículo."
        },
        {
            icon: <Eye className="w-12 h-12 text-blue-500" />,
            title: "Monitoreo 24/7",
            desc: "Nuestro equipo central supervisa cada trayecto en tiempo real para garantizar que llegues a tu destino sin incidentes."
        },
        {
            icon: <Map className="w-12 h-12 text-purple-500" />,
            title: "Comparte tu Viaje",
            desc: "Envía un enlace de seguimiento a tus familiares o amigos para que sepan tu ubicación exacta en todo momento."
        },
        {
            icon: <Smartphone className="w-12 h-12 text-amber-500" />,
            title: "Botón de Pánico",
            desc: "Integrado en la app para contacto inmediato con soporte y servicios de emergencia ante cualquier eventualidad."
        }
    ];

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">Seguridad Extrema</span>
                        <h2 className="text-4xl font-black mt-4 mb-8 text-gray-900 leading-tight">
                            Viajar con MotoTX es más seguro que cualquier otra opción
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {points.map((point, i) => (
                                <div key={i} className="flex flex-col gap-4">
                                    <div className="p-3 bg-gray-50 w-fit rounded-2xl">
                                        {point.icon}
                                    </div>
                                    <h3 className="font-bold text-xl text-gray-900">{point.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{point.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:w-1/2 relative">
                        <div className="absolute -inset-4 bg-blue-100 rounded-[3rem] blur-2xl opacity-20 rotate-3"></div>
                        <img
                            src="https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                            className="relative rounded-[2.5rem] shadow-2xl z-10"
                            alt="Casco de seguridad"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SafetyProtocol;
