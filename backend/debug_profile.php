<?php
// debug_profile.php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;

try {
    // 1. Simulate Login to get valid token
    $user = User::where('rol', 'cliente')->first();
    if (!$user) die("No user found");
    
    $token = JWTAuth::fromUser($user);
    
    echo "Simulating Profile Request for User ID: {$user->id}\n";
    
    // 2. Make Request to /api/profile
    $request = Illuminate\Http\Request::create('/api/profile', 'GET');
    $request->headers->set('Authorization', 'Bearer ' . $token);
    
    $response = $kernel->handle($request);
    
    echo "Status: " . $response->getStatusCode() . "\n";
    $content = json_decode($response->getContent(), true);
    
    if (isset($content['user']['cliente_forfaits'])) {
        echo "cliente_forfaits found. Count: " . count($content['user']['cliente_forfaits']) . "\n";
        print_r($content['user']['cliente_forfaits']);
    } else {
        echo "cliente_forfaits NOT found in response.\n";
        print_r($content);
    }

} catch (\Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
