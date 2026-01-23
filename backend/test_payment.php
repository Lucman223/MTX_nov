<?php

use App\Http\Controllers\Pagos\PaymentController;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Forfait;

// Simulate Login
$user = User::where('email', 'cliente@mototx.com')->first();
auth()->login($user);

// Get a Forfait
$forfait = Forfait::first();
if(!$forfait) {
    echo "Error: No forfaits found.\n";
    exit;
}

// Create Request
$request = Request::create('/api/pagos/iniciar', 'POST', [
    'forfait_id' => $forfait->id,
    'metodo_pago' => 'orange_money'
]);

// Call Controller
echo "Simulando pago para usuario: {$user->email}\n";
$controller = new PaymentController();
$response = $controller->initiatePayment($request);

$data = json_decode($response->getContent(), true);

if (isset($data['payment_url']) && strpos($data['payment_url'], 'orange-money.com') !== false) {
    echo "¡Éxito! URL de pago generada correctamente:\n";
    echo $data['payment_url'] . "\n";
} else {
    echo "Error en la generación del pago.\n";
    print_r($data);
}
