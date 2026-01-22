import React, { createContext, useState, useEffect, useContext } from 'react';

const AccessibilityContext = createContext({});

export const AccessibilityProvider = ({ children }) => {
    const [isDyslexic, setIsDyslexic] = useState(() => {
        return localStorage.getItem('accessibility-dyslexic') === 'true';
    });

    useEffect(() => {
        if (isDyslexic) {
            document.documentElement.classList.add('accessibility-dyslexic');
            localStorage.setItem('accessibility-dyslexic', 'true');
        } else {
            document.documentElement.classList.remove('accessibility-dyslexic');
            localStorage.setItem('accessibility-dyslexic', 'false');
        }
    }, [isDyslexic]);

    const toggleDyslexic = () => setIsDyslexic(prev => !prev);

    return (
        <AccessibilityContext.Provider value={{ isDyslexic, toggleDyslexic }}>
            {children}
        </AccessibilityContext.Provider>
    );
};

export const useAccessibility = () => useContext(AccessibilityContext);
