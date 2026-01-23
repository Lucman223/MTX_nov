<?php

use App\Events\MotoristaLocationUpdated;
use App\Models\MotoristaPerfil;
use App\Models\Viaje;

// Asegúrate de que existe un viaje activo para pruebas
// Moto ID: 3 (moto@mototx.com)
$motorista = MotoristaPerfil::where('usuario_id', 3)->first();

if (!$motorista) {
    echo "Error: No se encontró el perfil de motorista (ID 3).\n";
    exit(1);
}

// Bamako coordinates path
$path = [
    [12.6392, -8.0029],
    [12.6394, -8.0028],
    [12.6396, -8.0027],
    [12.6398, -8.0026],
    [12.6400, -8.0025],
    [12.6402, -8.0024],
    [12.6404, -8.0023],
    [12.6406, -8.0022],
];

echo "Iniciando simulación de ruta...\n";

foreach ($path as $index => $coords) {
    $motorista->current_lat = $coords[0];
    $motorista->current_lng = $coords[1];
    $motorista->save();

    echo "[$index] Emitiendo ubicación: {$coords[0]}, {$coords[1]}\n";
    event(new MotoristaLocationUpdated($motorista));
    
    sleep(2);
}

echo "Simulación completada.\n";
