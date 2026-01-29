<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

header('Content-Type: application/json');

$forfaits = \App\Models\Forfait::all();
$data = [
    'db_raw' => $forfaits->toArray(),
    'locales_check' => []
];

foreach (['es', 'en', 'fr'] as $loc) {
    $path = __DIR__ . "/resources/js/locales/{$loc}.json";
    if (file_exists($path)) {
        $json = json_decode(file_get_contents($path), true);
        $data['locales_check'][$loc] = $json['plans'] ?? 'NO_PLANS_KEY';
    } else {
        $data['locales_check'][$loc] = 'FILE_NOT_FOUND';
    }
}

echo json_encode($data, JSON_PRETTY_PRINT);
