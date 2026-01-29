import React from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/Common/SEO';
import { useNavigate } from 'react-router-dom';

/**
 * PrivacyPolicy Component
 *
 * [ES] Página informativa sobre el tratamiento de datos personales y privacidad.
 * [FR] Page informative sur le traitement des données personnelles et la confidentialité.
 */
const PrivacyPolicy = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="main-content-centered" style={{ maxWidth: '900px', padding: '4rem 2rem' }}>
            <SEO
                title={t('seo.privacy_title')}
                description={t('seo.privacy_desc')}
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
                    Politique de Confidentialité
                </h1>

                <p style={{ marginBottom: '2rem', color: '#6b7280' }}>
                    <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
                </p>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>1. Cadre Légal (Mali)</h2>
                    <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                        MotoTX s'engage à traiter vos données personnelles conformément à la <strong>Loi n°2013-015 du 21 mai 2013 portant protection des données à caractère personnel en République du Mali</strong>. Le traitement de vos données a fait l'objet d'une déclaration auprès de l'Autorité de Protection des Données à Caractère Personnel (APDP).
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>2. Collecte des Données</h2>
                    <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                        MotoTX collecte les données suivantes pour assurer le fonctionnement du service :
                    </p>
                    <ul style={{ color: '#4b5563', lineHeight: '1.8', marginLeft: '1.5rem' }}>
                        <li>Informations d'identité (Nom, Email, Téléphone).</li>
                        <li>Données de géolocalisation en temps réel (essentielles pour la mise en relation et la sécurité).</li>
                        <li>Détails du véhicule (pour les conducteurs).</li>
                        <li>Historique des transactions et des trajets.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>3. Utilisation des Données</h2>
                    <p style={{ color: '#4b5563', lineHeight: '1.8' }}>Vos données sont traitées pour :</p>
                    <ul style={{ color: '#4b5563', lineHeight: '1.8', marginLeft: '1.5rem' }}>
                        <li>La mise en relation technique entre conducteurs et clients.</li>
                        <li>Le calcul des itinéraires et la sécurité des passagers.</li>
                        <li>La gestion comptable des forfaits et des paiements.</li>
                        <li>Le respect des obligations légales maliennes.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>4. Vos Droits</h2>
                    <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                        Conformément à la loi malienne, vous disposez d'un droit d'accès, de rectification et d'opposition pour motifs légitimes au traitement de vos données.
                    </p>
                    <p style={{ marginTop: '1rem', color: '#4b5563', lineHeight: '1.8' }}>
                        Pour exercer ces droits, vous pouvez nous contacter à :
                        <a href="mailto:privacy@mototx.ml" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}> privacy@mototx.ml</a>.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>5. Conservation et Sécurité</h2>
                    <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                        Les données sont conservées pendant la durée de vie de votre compte plus les délais de prescription légaux. Nous utilisons des protocoles de chiffrement pour garantir l'intégrité de vos informations sur nos serveurs.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
