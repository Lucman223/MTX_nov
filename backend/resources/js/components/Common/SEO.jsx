import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const SEO = ({ title, description, keywords }) => {
    const { t } = useTranslation();

    const siteTitle = "MotoTX - Bamako";
    const defaultDescription = t('seo.default_description', "Transport fiable et rapide à Bamako. Taxis motos sécurisés.");
    const defaultKeywords = "moto, taxi, bamako, transport, mali, mototx";

    return (
        <Helmet>
            <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || defaultKeywords} />
            <meta property="og:title" content={title ? `${title} | ${siteTitle}` : siteTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:type" content="website" />
            <meta name="theme-color" content="#2563eb" />
        </Helmet>
    );
};

export default SEO;
