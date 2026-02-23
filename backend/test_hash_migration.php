<?php

// [ES] Test aislado de lógica de Hashing Argon2id
// [FR] Test isolé de la logique de hachage Argon2id

$password = 'password123';

echo "--- INICIO DE PRUEBA DE HASHING ---\n";

// 1. Simular Hash Antiguo (BCRYPT)
$oldHash = password_hash($password, PASSWORD_BCRYPT);
echo "[1] Hash BCRYPT generado: $oldHash\n";

// 2. Verificar si necesita re-hash a Argon2id
$options = [
    'memory_cost' => 65536,
    'time_cost' => 4,
    'threads' => 1
];

if (password_needs_rehash($oldHash, PASSWORD_ARGON2ID, $options)) {
    echo "[2] CORRECTO: Se ha detectado que el hash BCRYPT necesita actualización.\n";
    
    // 3. Generar nuevo hash Argon2id
    $newHash = password_hash($password, PASSWORD_ARGON2ID, $options);
    echo "[3] Nuevo Hash Argon2id: $newHash\n";
    
    // 4. Verificar el nuevo hash
    if (password_verify($password, $newHash)) {
        echo "[4] ÉXITO: La contraseña es válida con el nuevo hash.\n";
        
        // 5. Verificar que ya NO necesita re-hash
        if (!password_needs_rehash($newHash, PASSWORD_ARGON2ID, $options)) {
            echo "[5] ÉXITO: El sistema reconoce el nuevo hash como actualizado.\n";
        } else {
            echo "[ERROR]: El sistema sigue pidiendo re-hash para Argon2id.\n";
        }
    } else {
        echo "[ERROR]: Falló la verificación de la contraseña con el nuevo hash.\n";
    }
} else {
    echo "[ERROR]: No se detectó la necesidad de migrar de BCRYPT a Argon2id.\n";
}

echo "--- FIN DE PRUEBA ---\n";
