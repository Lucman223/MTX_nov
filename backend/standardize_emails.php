<?php

use App\Models\User;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- Standardizing Emails to @test.com ---\n";

// 1. Admin (ID 1)
$admin = User::find(1);
if ($admin) {
    echo "Admin (ID 1): {$admin->email} -> admin@test.com\n";
    $admin->update(['email' => 'admin@test.com']);
}

// 2. Moto (ID 3)
$moto = User::find(3);
if ($moto) {
    echo "Moto (ID 3): {$moto->email} -> moto@test.com\n";
    $moto->update(['email' => 'moto@test.com']);
}

// 3. Client (ID 2)
$client = User::find(2);
if ($client) {
    echo "Client (ID 2): {$client->email} -> client@test.com (Already OK?)\n";
    if ($client->email !== 'client@test.com') {
         $client->update(['email' => 'client@test.com']);
    }
}

echo "DONE. All passwords are 'password'.\n";
