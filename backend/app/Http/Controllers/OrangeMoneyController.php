<?php

namespace App\Http\Controllers;

use App\Models\Forfait;
use App\Models\Transaccion;
use App\Models\ClienteForfait;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Ibracilinks\OrangeMoney\OrangeMoney; // Assuming this is the correct import

class OrangeMoneyController extends Controller
{
    protected $orangeMoney;

    public function __construct()
    {
        // Initialize OrangeMoney with your credentials from .env
        // You'll need to configure these in your .env file
        $this->orangeMoney = new OrangeMoney(
            env('ORANGE_MONEY_MERCHANT_KEY'),
            env('ORANGE_MONEY_AUTH_HEADER'),
            env('ORANGE_MONEY_PAYMENT_URL'),
            env('ORANGE_MONEY_CALLBACK_URL')
        );
    }

    public function initiatePayment(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'forfait_id' => 'required|exists:forfaits,id',
            'phone_number' => 'required|string|regex:/^(\+223)?[6-9]\d{7}$/', // Example for Mali numbers
        ]);

        $forfait = Forfait::find($request->forfait_id);

        // Create a pending transaction record
        $transaccion = Transaccion::create([
            'cliente_id' => $user->id,
            'forfait_id' => $forfait->id,
            'monto' => $forfait->precio,
            'moneda' => 'XOF', // Assuming XOF for Mali
            'estado' => 'pendiente',
            'metodo_pago' => 'Orange Money',
            'fecha_transaccion' => Carbon::now(),
        ]);

        try {
            $response = $this->orangeMoney->pay(
                $request->phone_number,
                $forfait->precio,
                $transaccion->id, // Use our transaction ID as order ID
                'Compra de Forfait ' . $forfait->nombre
            );

            // Update transaction with Orange Money's transaction ID if available
            $transaccion->update([
                'referencia_externa' => $response['txnid'] ?? null, // Assuming txnid is the external ID
                'estado' => 'iniciado',
            ]);

            return response()->json([
                'message' => 'Payment initiated successfully',
                'data' => $response,
                'transaction_id' => $transaccion->id,
            ]);
        } catch (\Exception $e) {
            $transaccion->update(['estado' => 'fallido']);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function handleCallback(Request $request)
    {
        // This method will receive the callback from Orange Money
        // The exact structure of the callback depends on Orange Money's API
        // You'll need to verify the callback's authenticity and parse its data

        $callbackData = $request->all();
        $ourTransactionId = $callbackData['order_id'] ?? null; // Assuming order_id is our transaction ID

        if (!$ourTransactionId) {
            return response()->json(['error' => 'Invalid callback data'], 400);
        }

        $transaccion = Transaccion::find($ourTransactionId);

        if (!$transaccion) {
            return response()->json(['error' => 'Transaction not found'], 404);
        }

        // Example: Assuming 'status' field in callback indicates success/failure
        $orangeMoneyStatus = $callbackData['status'] ?? 'unknown';

        if ($orangeMoneyStatus === 'SUCCESS') { // Adjust based on actual Orange Money success status
            $transaccion->update(['estado' => 'completado']);

            // Create or update ClienteForfait
            $forfait = Forfait::find($transaccion->forfait_id);
            $clienteForfait = ClienteForfait::where('cliente_id', $transaccion->cliente_id)->first();

            if ($clienteForfait) {
                // Update existing forfait (e.g., add trips, extend expiration)
                $clienteForfait->update([
                    'viajes_restantes' => $clienteForfait->viajes_restantes + $forfait->viajes_incluidos,
                    'fecha_expiracion' => Carbon::parse($clienteForfait->fecha_expiracion)->addDays($forfait->dias_validez),
                ]);
            } else {
                // Create new forfait for the client
                ClienteForfait::create([
                    'cliente_id' => $transaccion->cliente_id,
                    'forfait_id' => $forfait->id,
                    'fecha_compra' => Carbon::now(),
                    'fecha_expiracion' => Carbon::now()->addDays($forfait->dias_validez),
                    'viajes_restantes' => $forfait->viajes_incluidos,
                ]);
            }

            return response()->json(['message' => 'Payment successful and forfait updated']);
        } else {
            $transaccion->update(['estado' => 'fallido']);
            return response()->json(['message' => 'Payment failed']);
        }
    }
}
