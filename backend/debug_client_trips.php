<?php

use App\Models\Viaje;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- Client Trips Debug ---\n";

// Client ID 2
$viajes = Viaje::where('cliente_id', 2)->get();

foreach ($viajes as $v) {
    echo "Trip ID: {$v->id} | Status: {$v->estado} | Date: {$v->created_at}\n";
}
