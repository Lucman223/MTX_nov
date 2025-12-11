<?php

use App\Models\Viaje;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- Latest Trip Debug ---\n";

$viaje = Viaje::latest()->first();

if (!$viaje) {
    echo "No trips found!\n";
} else {
    echo "ID: {$viaje->id}\n";
    echo "Cliente: {$viaje->cliente_id}\n";
    echo "Estado: {$viaje->estado}\n";
    echo "Created: {$viaje->created_at}\n";
}
