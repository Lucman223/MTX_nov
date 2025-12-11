<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Viaje;
use App\Models\User;

echo "=== DEBUG: Viajes Completados ===\n\n";

$viajes = Viaje::where('estado', 'completado')
    ->with(['cliente', 'motorista', 'calificacion'])
    ->get();

echo "Total viajes completados: " . $viajes->count() . "\n\n";

foreach ($viajes as $viaje) {
    echo "Viaje ID: {$viaje->id}\n";
    echo "  Cliente ID: {$viaje->cliente_id} - " . ($viaje->cliente ? $viaje->cliente->name : 'NULL') . "\n";
    echo "  Motorista ID: {$viaje->motorista_id} - " . ($viaje->motorista ? $viaje->motorista->name : 'NULL') . "\n";
    echo "  Estado: {$viaje->estado}\n";
    echo "  Creado: {$viaje->created_at}\n";
    echo "  Actualizado: {$viaje->updated_at}\n";
    echo "  Calificación: " . ($viaje->calificacion ? "Sí (puntuación: {$viaje->calificacion->puntuacion})" : "No") . "\n";
    echo "---\n";
}

echo "\n=== Usuarios ===\n";
$cliente = User::where('email', 'client@test.com')->first();
$motorista = User::where('email', 'amadou@test.com')->first();

if ($cliente) {
    echo "Cliente: {$cliente->name} (ID: {$cliente->id}, Rol: {$cliente->rol})\n";
} else {
    echo "Cliente client@test.com NO ENCONTRADO\n";
}

if ($motorista) {
    echo "Motorista: {$motorista->name} (ID: {$motorista->id}, Rol: {$motorista->rol})\n";
} else {
    echo "Motorista amadou@test.com NO ENCONTRADO\n";
}
