import React from 'react';
import { useTranslation } from 'react-i18next';

const ContactForm = ({ colors }) => {
    const { t } = useTranslation();

    return (
        <section id="contact" style={{ padding: '6rem 2rem', background: 'white' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <h3 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: '#1f2937' }}>
                    {t('landing.contact_title')}
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '3rem' }}>{t('landing.contact_subtitle')}</p>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} onSubmit={(e) => e.preventDefault()}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input type="text" placeholder={t('landing.contact_name')} className="mtx-input" style={{ width: '100%' }} />
                        <input type="email" placeholder={t('common.email')} className="mtx-input" style={{ width: '100%' }} />
                    </div>
                    <textarea placeholder={t('landing.contact_message')} rows="4" className="mtx-input" style={{ resize: 'none' }}></textarea>
                    <button className="mtx-button" style={{
                        padding: '1rem',
                        background: colors.primary,
                        boxShadow: `0 4px 12px ${colors.primary}40`,
                        fontSize: '1.1rem'
                    }}>
                        {t('landing.contact_send')}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ContactForm;
