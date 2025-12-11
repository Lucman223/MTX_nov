<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "PUSHER_APP_KEY: " . env('PUSHER_APP_KEY') . "\n";
echo "VITE_PUSHER_APP_KEY: " . env('VITE_PUSHER_APP_KEY') . "\n";
echo "VITE_PUSHER_HOST: " . env('VITE_PUSHER_HOST') . "\n";
