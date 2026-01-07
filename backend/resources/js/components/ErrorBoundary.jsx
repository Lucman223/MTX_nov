import React from 'react';

/**
 * ErrorBoundary Component
 *
 * [ES] Capturador de errores de nivel superior para la aplicación.
 *      Evita que toda la app se cuelgue ante un error de renderizado, mostrando un mensaje de error amigable y detalles técnicos.
 *
 * [FR] Captureur d'erreurs de haut niveau pour l'application.
 *      Empêche toute l'application de planter en cas d'erreur de rendu, affichant un message d'erreur convivial et des détails techniques.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-50 border border-red-200 rounded m-4">
                    <h1 className="text-xl font-bold text-red-700 mb-4">Algo salió mal.</h1>
                    <details className="whitespace-pre-wrap text-sm text-red-600 font-mono">
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
