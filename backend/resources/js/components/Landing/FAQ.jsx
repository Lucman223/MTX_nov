import React from 'react';
import { useTranslation } from 'react-i18next';

const FAQ = ({ colors }) => {
    const { t } = useTranslation();

    return (
        <section id="faq" style={{ padding: '6rem 2rem', background: '#f9fafb' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h3 style={{ fontSize: '2.5rem', fontWeight: '800', textAlign: 'center', marginBottom: '3rem', color: '#1f2937' }}>
                    {t('landing.faq_title')}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {[1, 2].map(i => (
                        <div key={i} className="mtx-card" style={{ padding: '1.5rem' }}>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: colors.primary, marginBottom: '0.75rem' }}>
                                {t(`landing.faq_q${i}`)}
                            </h4>
                            <p style={{ color: '#4b5563', lineHeight: 1.6 }}>
                                {t(`landing.faq_a${i}`)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
