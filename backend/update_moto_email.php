<?php

use App\Models\User;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- Update Moto Email ---\n";

// Target: ID 3 (Moto Test) or by current email
$user = User::where('email', 'moto@test.com')->first();

if (!$user) {
    // Check if already updated
    $check = User::where('email', 'moto@mototx.com')->first();
    if ($check) {
        echo "User is already moto@mototx.com (ID: {$check->id}). Nothing to do.\n";
    } else {
        echo "User moto@test.com NOT FOUND.\n";
    }
    exit;
}

echo "Found user: {$user->name} ({$user->email})\n";

// Check if target email exists
$conflict = User::where('email', 'moto@mototx.com')->first();
if ($conflict) {
    echo "ERROR: Target email 'moto@mototx.com' is already taken by ID {$conflict->id}.\n";
    echo "Aborting update.\n";
    exit;
}

$user->update(['email' => 'moto@mototx.com']);

echo "SUCCESS: Updated email to 'moto@mototx.com'.\n";
echo "Password remains unchanged ('password').\n";
