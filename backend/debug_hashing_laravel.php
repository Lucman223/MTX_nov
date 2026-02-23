<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Hash;

$password = 'password123';
echo "--- DIAGNÓSTICO DE HASHING ---\n";
echo "Driver actual: " . config('hashing.driver') . "\n";

// 1. Probar Bcrypt (Fallback)
$bcryptHash = password_hash($password, PASSWORD_BCRYPT);
echo "[1] Hash Bcrypt generado: $bcryptHash\n";
echo "[2] Hash::check (Bcrypt): " . (Hash::check($password, $bcryptHash) ? "PASS" : "FAIL") . "\n";

// 2. Probar Argon2id
try {
    $argonHash = Hash::make($password);
    echo "[3] Hash Argon2id generado: $argonHash\n";
    echo "[4] Hash::check (Argon2id): " . (Hash::check($password, $argonHash) ? "PASS" : "FAIL") . "\n";
} catch (\Exception $e) {
    echo "[!] ERROR EN ARGON2ID: " . $e->getMessage() . "\n";
}

// 3. Probar NeedsRehash
echo "[5] NeedsRehash (Bcrypt -> Argon2id): " . (Hash::needsRehash($bcryptHash) ? "YES" : "NO") . "\n";
