import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component
 *
 * [ES] Gestiona los meta-tags del encabezado (título, descripción) para mejorar el posicionamiento y la accesibilidad.
 *      Utiliza react-helmet-async para la gestión dinámica del DOM.
 *
 * [FR] Gère les balises méta d'en-tête (titre, description) pour améliorer le positionnement et l'accessibilité.
 *      Utilise react-helmet-async pour la gestion dynamique du DOM.
 */
const SEO = ({ title, description, keywords }) => {
    const siteTitle = 'MotoTX';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const defaultDescription = 'MotoTX - Transporte seguro y confiable en Bamako, Mali.';

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            {keywords && <meta name="keywords" content={keywords} />}

            {/* OpenGraph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDescription} />
        </Helmet>
    );
};

export default SEO;
