import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Viaje from './components/Viaje'; // We will create this next

// A simple placeholder for the home page
function Home() {
    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>Bienvenido a MotoTX</h1>
            <p>Esta es la página de inicio de la aplicación React.</p>
            <nav>
                <Link to="/viaje/1" style={{ color: 'blue' }}>Ver Viaje de Prueba (ID: 1)</Link>
            </nav>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/viaje/:viajeId" element={<Viaje />} />
            </Routes>
        </Router>
    );
}

export default App;
