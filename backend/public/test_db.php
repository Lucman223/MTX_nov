<?php

$host = getenv('DB_HOST');
$port = getenv('DB_PORT');
$db   = getenv('DB_DATABASE');
$user = getenv('DB_USERNAME');
$pass = getenv('DB_PASSWORD');

echo "Intentando conectar a:\n";
echo "Host: " . $host . "\n";
echo "Port: " . $port . "\n";
echo "DB: " . $db . "\n";
echo "User: " . $user . "\n\n";

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, $user, $pass, $options);
    echo "¡CONEXIÓN EXITOSA A LA BASE DE DATOS AIVEN!\n";
} catch (\PDOException $e) {
    echo "ERROR DE CONEXIÓN PDO: \n" . $e->getMessage() . "\n";
    echo "Código de error: " . $e->getCode() . "\n";
} catch (\Exception $e) {
    echo "OTRO ERROR: \n" . $e->getMessage() . "\n";
}
