<?php
// debug_user_json.php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

$user = User::where('rol', 'cliente')->first();
$user->load(['clienteForfaits']);

echo json_encode($user, JSON_PRETTY_PRINT);
