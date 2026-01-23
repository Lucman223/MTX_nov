<?php

use App\Http\Controllers\Admin\ReportController;
use Illuminate\Http\Request;

// Create Request
$request = Request::create('/reports/monthly', 'GET', [
    'month' => now()->month,
    'year' => now()->year
]);

// Call Controller
echo "Generando reporte para: " . now()->format('M Y') . "\n";
$controller = new ReportController();
$response = $controller->generateMonthlyReport($request);

// Check if view is returned
if (method_exists($response, 'render')) {
    $html = $response->render();
    if (strpos($html, 'Reporte Mensual') !== false && strpos($html, 'Ingresos Totales') !== false) {
        echo "¡Éxito! El reporte HTML se ha generado correctamente.\n";
        echo "Contiene las secciones clave: 'Reporte Mensual' e 'Ingresos Totales'.\n";
    } else {
        echo "Error: El HTML generado no parece correcto.\n";
    }
} else {
    echo "Error: La respuesta no es una Vista válida.\n";
}
