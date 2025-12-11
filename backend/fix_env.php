<?php
$envPath = __DIR__ . '/.env';
if (!file_exists($envPath)) {
    die(".env not found\n");
}

$lines = file($envPath, FILE_IGNORE_NEW_LINES);
$newLines = [];
$foundReverb = false;

foreach ($lines as $line) {
    // Remove lines that look corrupted by previous PowerShell command (triple quotes)
    if (strpos($line, '"""') !== false || strpos($line, '" "') !== false) {
        continue;
    }
    // Remove lines checking for duplicates if we are re-adding them
    if (strpos($line, 'PUSHER_') === 0 || strpos($line, 'VITE_PUSHER_') === 0 || strpos($line, 'BROADCAST_CONNECTION=reverb') === 0) {
        continue;
    }
    $newLines[] = $line;
}

// Add valid config
$config = [
    '',
    'BROADCAST_CONNECTION=pusher',
    'PUSHER_APP_ID=app-id',
    'PUSHER_APP_KEY=app-key',
    'PUSHER_APP_SECRET=app-secret',
    'PUSHER_APP_HOST=127.0.0.1',
    'PUSHER_APP_PORT=8080',
    'PUSHER_APP_SCHEME=http',
    'PUSHER_APP_CLUSTER=mt1',
    '',
    'VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"',
    'VITE_PUSHER_HOST="${PUSHER_APP_HOST}"',
    'VITE_PUSHER_PORT="${PUSHER_APP_PORT}"',
    'VITE_PUSHER_SCHEME="${PUSHER_APP_SCHEME}"',
    'VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"',
];

$finalContent = implode("\n", array_merge($newLines, $config));
file_put_contents($envPath, $finalContent);

echo "Repaired .env\n";
