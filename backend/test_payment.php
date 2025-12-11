<?php
// test_payment.php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Http\Controllers\Pagos\PaymentController;
use App\Models\User;
use App\Models\Forfait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

// Simulate authenticated user
$user = User::where('rol', 'cliente')->first();
auth()->login($user);

echo "Testing Payment Logic for User: {$user->email}\n";

// 1. Get a Forfait
$forfait = Forfait::first();
if (!$forfait) {
    die("No forfaits found via seeder. Please seed DB first.\n");
}
echo "Selected Forfait: {$forfait->nombre} ({$forfait->precio} CFA)\n";

// 2. Initiate Payment
$controller = app(PaymentController::class);
$requestInit = Request::create('/api/pagos/iniciar', 'POST', [
    'forfait_id' => $forfait->id,
    'metodo_pago' => 'orange_money'
]);

// Helper to handle response content which might be JSON or object
$responseInit = $controller->initiatePayment($requestInit);
$dataInit = json_decode($responseInit->getContent(), true);

if (!isset($dataInit['transaction_id'])) {
    die("Error initiating payment: " . print_r($dataInit, true));
}

$transactionId = $dataInit['transaction_id'];
echo "Transaction Initiated. ID: {$transactionId}. Ref: {$dataInit['payment_url']}\n";

// 3. Verify Payment
echo "Verifying Payment...\n";
$requestVerify = Request::create('/api/pagos/verificar', 'POST', [
    'transaction_id' => $transactionId,
    'status' => 'success'
]);

$responseVerify = $controller->verifyPayment($requestVerify);
$dataVerify = json_decode($responseVerify->getContent(), true);

echo "Verification Result: " . print_r($dataVerify, true) . "\n";

// 4. Check Database
$balance = $user->clienteForfaits()->sum('viajes_restantes');
echo "Current Trip Balance: {$balance}\n";

if ($dataVerify['status'] === 'completed') {
    echo "TEST PASSED: Payment flow completed successfully.\n";
} else {
    echo "TEST FAILED: Payment verification failed.\n";
}
