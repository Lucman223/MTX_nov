<?php

use App\Models\User;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- Current Users ---\n";
$users = User::all();
foreach ($users as $u) {
    echo "[ID: {$u->id}] {$u->name} - {$u->email} ({$u->rol})\n";
}
