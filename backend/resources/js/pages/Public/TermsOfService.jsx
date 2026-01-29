import React from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/Common/SEO';
import { useNavigate } from 'react-router-dom';

/**
 * TermsOfService Component
 *
 * [ES] Términos y Condiciones de Uso (CGU) de la plataforma.
 * [FR] Conditions Générales d'Utilisation (CGU) de la plateforme MotoTX.
 */
const TermsOfService = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="main-content-centered" style={{ maxWidth: '900px', padding: '4rem 2rem' }}>
            <SEO
                title={t('seo.terms_title')}
                description={t('seo.terms_desc')}
            />

            <button
                onClick={() => navigate(-1)}
                className="mtx-button"
                style={{ marginBottom: '2rem', background: '#f3f4f6' }}
            >
                ← {t('common.back', 'Retour')}
            </button>

            <div className="mtx-card" style={{ padding: '3rem' }}>
                <h1 style={{ color: '#2563eb', marginBottom: '1.5rem', fontSize: '2.5rem', fontWeight: 'bold' }}>
                    Conditions Générales d'Utilisation
                </h1>

                <p style={{ marginBottom: '2rem', color: '#6b7280' }}>
                    <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
                </p>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>1. Objet du Service</h2>
                    <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                        MotoTX est une plateforme technologique facilitant la mise en relation entre des conducteurs de mototaxis indépendants et des clients en République du Mali. MotoTX n'est pas une entreprise de transport mais un intermédiaire technique.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>2. Conditions d'Accès</h2>
                    <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                        L'utilisateur doit être âgé d'au moins 18 ans. Les conducteurs doivent posséder un permis de conduire valide et les documents du véhicule conformes à la réglementation malienne en vigueur.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>3. Engagements du Conducteur</h2>
                    <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                        Le conducteur s'engage à :
                    </p>
                    <ul style={{ color: '#4b5563', lineHeight: '1.8', marginLeft: '1.5rem' }}>
                        <li>Fournir un casque au passager.</li>
                        <li>Respecter scrupuleusement le code de la route.</li>
                        <li>Maintenir son véhicule dans un état de propreté et de sécurité optimal.</li>
                        <li>Se comporter avec courtoisie envers les clients.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>4. Tarification et Paiements</h2>
                    <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                        Les prix sont fixés selon les forfaits prépayés ou les tarifs en vigueur affichés sur l'application. Tout trajet initié via la plateforme doit être finalisé selon les modalités de paiement choisies.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>5. Responsabilité</h2>
                    <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                        La responsabilité de MotoTX est limitée au fonctionnement technique de l'application. En cas d'accident, la responsabilité civile du conducteur est engagée conformément au droit malien.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>6. Litiges</h2>
                    <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                        Les présentes CGU sont régies par le droit malien. Tout litige non résolu à l'amiable sera porté devant les tribunaux compétents de Bamako.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default TermsOfService;
