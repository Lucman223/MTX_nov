<?php

use App\Models\Viaje;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- Cancel Stale Trip ID 9 ---\n";

$viaje = Viaje::find(9);
if ($viaje) {
    $viaje->update(['estado' => 'cancelado']);
    echo "Trip ID 9 cancelled.\n";
} else {
    echo "Trip ID 9 not found.\n";
}
