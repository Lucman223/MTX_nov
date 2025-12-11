<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

$user = User::where('email', 'client@test.com')->first();
auth()->login($user);

// Simulate Controller Logic
$user->load(['clienteForfaits', 'motorista_perfil']);

echo json_encode($user->toArray(), JSON_PRETTY_PRINT);
