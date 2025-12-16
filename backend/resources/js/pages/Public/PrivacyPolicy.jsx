import React from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/Common/SEO';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
            <SEO title="Politique de Confidentialité - MotoTX" />

            <button
                onClick={() => navigate(-1)}
                style={{
                    marginBottom: '1rem',
                    padding: '0.5rem 1rem',
                    background: '#e5e7eb',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                }}
            >
                ← {t('common.back', 'Retour')}
            </button>

            <h1 style={{ color: '#2563eb', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                Politique de Confidentialité
            </h1>

            <p><strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString()}</p>

            <section style={{ marginBottom: '2rem' }}>
                <h2>1. Collecte des Données</h2>
                <p>
                    MotoTX collecte les données suivantes pour assurer le fonctionnement du service :
                </p>
                <ul>
                    <li>Informations d'identité (Nom, Email, Téléphone).</li>
                    <li>Données de géolocalisation (pour les trajets).</li>
                    <li>Historique des courses et transactions.</li>
                </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2>2. Utilisation des Données</h2>
                <p>Vos données sont utilisées pour :</p>
                <ul>
                    <li>Vous mettre en relation avec un conducteur ou un client.</li>
                    <li>Gérer les paiements et les forfaits.</li>
                    <li>Améliorer la sécurité et la qualité du service.</li>
                </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2>3. Vos Droits (RGPD)</h2>
                <p>Conformément à la réglementation, vous disposez des droits suivants :</p>
                <ul>
                    <li>Droit d'accès à vos données.</li>
                    <li>Droit de rectification.</li>
                    <li>Droit à l'effacement ("Droit à l'oubli").</li>
                </ul>
                <p>
                    Pour exercer ces droits ou supprimer votre compte, veuillez nous contacter à :
                    <a href="mailto:privacy@mototx.ml"> privacy@mototx.ml</a> ou utiliser l'option de suppression dans votre profil.
                </p>
            </section>

            <section>
                <h2>4. Sécurité</h2>
                <p>
                    Nous mettons en œuvre des mesures techniques appropriées pour protéger vos données contre l'accès non autorisé.
                </p>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
