<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Viaje;

echo "=== TEST: Endpoint /api/viajes/historial ===\n\n";

// Simulate authenticated user (cliente)
$cliente = User::where('email', 'client@test.com')->first();

if (!$cliente) {
    echo "❌ Cliente no encontrado\n";
    exit(1);
}

echo "✅ Simulando request como: {$cliente->name} (ID: {$cliente->id}, Rol: {$cliente->rol})\n\n";

// Simulate the controller logic
$query = Viaje::with(['cliente', 'motorista', 'calificacion'])
    ->where('estado', 'completado')
    ->orderBy('updated_at', 'desc');

if ($cliente->rol === 'cliente') {
    $query->where('cliente_id', $cliente->id);
} elseif ($cliente->rol === 'motorista') {
    $query->where('motorista_id', $cliente->id);
}

$viajes = $query->get();

echo "Viajes encontrados: " . $viajes->count() . "\n\n";

if ($viajes->count() > 0) {
    foreach ($viajes as $viaje) {
        echo "Viaje ID: {$viaje->id}\n";
        echo "  Cliente: " . ($viaje->cliente ? $viaje->cliente->name : 'NULL') . "\n";
        echo "  Motorista: " . ($viaje->motorista ? $viaje->motorista->name : 'NULL') . "\n";
        echo "  Fecha: {$viaje->updated_at}\n";
        echo "---\n";
    }
    
    echo "\n✅ El backend está retornando datos correctamente\n";
    echo "\nJSON que se enviaría al frontend:\n";
    echo json_encode([
        'data' => $viajes->toArray()
    ], JSON_PRETTY_PRINT);
} else {
    echo "⚠️  No se encontraron viajes para este usuario\n";
}
