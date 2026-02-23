<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

foreach (User::all() as $user) {
    echo "ID: {$user->id} | Email: {$user->email} | Rol: {$user->rol} | Hash: " . substr($user->password, 0, 10) . "...\n";
}
