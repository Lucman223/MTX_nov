<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Forfait;
use App\Models\Transaccion;
use App\Models\ClienteForfait;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Pagos\PaymentController;
use Illuminate\Http\Request;

echo "--- Simulating Payment Flow ---\n";

// 1. Setup Data
$client = User::where('email', 'client@test.com')->first();
if (!$client) {
    die("Error: Client not found.\n");
}
echo "Client: {$client->email} (ID: {$client->id})\n";

$forfait = Forfait::firstOrCreate(
    ['nombre' => 'Test Pack'],
    ['precio' => 1000, 'viajes_incluidos' => 5, 'dias_validez' => 7, 'descripcion' => 'Test', 'estado' => 'activo']
);
echo "Forfait: {$forfait->nombre} (ID: {$forfait->id})\n";

// Mock Auth
auth()->login($client);

// 2. Initiate Payment (Controller Call Simulation)
echo "\n[Step 1] Initiating Payment...\n";
$controller = new PaymentController();

$initRequest = Request::create('/api/pagos/iniciar', 'POST', [
    'forfait_id' => $forfait->id,
    'metodo_pago' => 'orange_money'
]);

// Determine if we can call the controller method directly or need to mock more components.
// Directly calling the method should work since we bootstrapped the app and logged in the user.
try {
    $response = $controller->initiatePayment($initRequest);
    $data = $response->getData(true);
    
    if ($response->status() !== 200) {
        print_r($data);
        die("Error initiating payment.\n");
    }
    
    $transactionId = $data['transaction_id'];
    echo "Message: {$data['message']}\n";
    echo "Transaction ID: {$transactionId}\n";
    echo "External Ref: " . Transaccion::find($transactionId)->referencia_externa . "\n";
    
} catch (\Exception $e) {
    die("Exception in Step 1: " . $e->getMessage() . "\n");
}

// 3. Verify Payment
echo "\n[Step 2] Verifying Payment (Success)...\n";
$verifyRequest = Request::create('/api/pagos/verificar', 'POST', [
    'transaction_id' => $transactionId,
    'status' => 'success'
]);

try {
    $response = $controller->verifyPayment($verifyRequest);
    $data = $response->getData(true);
    
    if ($response->status() !== 200) {
        print_r($data);
        die("Error verifying payment.\n");
    }
    
    echo "Message: {$data['message']}\n";
    
} catch (\Exception $e) {
    die("Exception in Step 2: " . $e->getMessage() . "\n");
}

// 4. Check Database
echo "\n[Step 3] Checking Database...\n";
$transaccion = Transaccion::find($transactionId);
echo "Transaction Status: {$transaccion->estado} (Expected: completado)\n";

$clienteForfait = ClienteForfait::where('cliente_id', $client->id)
    ->where('forfait_id', $forfait->id)
    ->latest()
    ->first();

if ($clienteForfait && $clienteForfait->created_at->diffInSeconds(now()) < 10) {
    echo "Forfait Assigned: YES\n";
    echo "Viajes Restantes: {$clienteForfait->viajes_restantes}\n";
    echo "Estado: {$clienteForfait->estado}\n";
} else {
    echo "Forfait Assigned: NO (or created too long ago)\n";
}

echo "\n--- Test Complete ---\n";
