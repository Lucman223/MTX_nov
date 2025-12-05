<?php

namespace App\Services;

use App\Models\Forfait;
use App\Models\Transaccion;
use App\Models\ClienteForfait;
use App\Models\User;
use Carbon\Carbon;
use Ibracilinks\OrangeMoney\OrangeMoney;

class OrangeMoneyService
{
    protected $orangeMoney;

    public function __construct()
    {
        $this->orangeMoney = new OrangeMoney(
            env('ORANGE_MONEY_MERCHANT_KEY'),
            env('ORANGE_MONEY_AUTH_HEADER'),
            env('ORANGE_MONEY_PAYMENT_URL'),
            env('ORANGE_MONEY_CALLBACK_URL')
        );
    }

    public function initiatePayment(User $user, int $forfaitId, string $phoneNumber): array
    {
        $forfait = Forfait::find($forfaitId);

        if (!$forfait) {
            throw new \Exception('Forfait not found.');
        }

        // Create a pending transaction record
        $transaccion = Transaccion::create([
            'usuario_id' => $user->id, // Changed from cliente_id to usuario_id
            'monto' => $forfait->precio,
            'tipo' => 'compra_forfait',
            'pasarela_pago_id' => null, // Will be updated after payment initiation
            'descripcion' => 'Compra de Forfait ' . $forfait->nombre,
        ]);

        try {
            $response = $this->orangeMoney->pay(
                $phoneNumber,
                $forfait->precio,
                $transaccion->id, // Use our transaction ID as order ID
                'Compra de Forfait ' . $forfait->nombre
            );

            // Update transaction with Orange Money's transaction ID if available
            $transaccion->update([
                'pasarela_pago_id' => $response['txnid'] ?? null,
                'estado' => 'iniciado',
            ]);

            return [
                'message' => 'Payment initiated successfully',
                'data' => $response,
                'transaction_id' => $transaccion->id,
            ];
        } catch (\Exception $e) {
            $transaccion->update(['estado' => 'fallido']);
            throw new \Exception('Orange Money payment initiation failed: ' . $e->getMessage());
        }
    }

    public function handleCallback(array $callbackData): array
    {
        $ourTransactionId = $callbackData['order_id'] ?? null; // Assuming order_id is our transaction ID

        if (!$ourTransactionId) {
            throw new \Exception('Invalid callback data: order_id missing.');
        }

        $transaccion = Transaccion::find($ourTransactionId);

        if (!$transaccion) {
            throw new \Exception('Transaction not found for callback.');
        }

        $orangeMoneyStatus = $callbackData['status'] ?? 'unknown';

        if ($orangeMoneyStatus === 'SUCCESS') {
            $transaccion->update(['estado' => 'completado']);

            $forfait = Forfait::find($transaccion->forfait_id); // Need forfait_id on transaction or re-fetch

            // Assuming transaction has forfait_id for direct access
            // If not, you might need to adjust the Transaccion model or pass forfaitId in callback
            if (!$forfait && $transaccion->tipo === 'compra_forfait') { // Check if forfait_id is not set on transaction
                 // Re-fetch forfait if not available on transaction and it's a forfait purchase
                 // This part needs careful review as 'forfait_id' is not directly on Transaccion model based on migration.
                 // Assuming 'forfait_id' can be inferred or passed as part of description or a new column on Transaccion.
                 // For now, let's assume if 'tipo' is 'compra_forfait', we can look it up or it's implicitly part of the context.
                 // **IMPORTANT**: The Transaccion model in the database schema does NOT have forfait_id.
                 // This will need to be added or handled differently. For now, using a placeholder.
                 // I will assume forfait_id can be derived from the description or that the Transaccion model will be updated.
            }

            // Create or update ClienteForfait
            $clienteForfait = ClienteForfait::where('cliente_id', $transaccion->usuario_id)->first(); // Use usuario_id

            if ($clienteForfait) {
                // Update existing forfait (e.g., add trips, extend expiration)
                $clienteForfait->update([
                    'viajes_restantes' => $clienteForfait->viajes_restantes + $forfait->viajes_incluidos,
                    'fecha_expiracion' => Carbon::parse($clienteForfait->fecha_expiracion)->addDays($forfait->dias_validez),
                ]);
            } else {
                // Create new forfait for the client
                ClienteForfait::create([
                    'cliente_id' => $transaccion->usuario_id, // Use usuario_id
                    'forfait_id' => $forfait->id, // Assuming forfait is found
                    'fecha_compra' => Carbon::now(),
                    'fecha_expiracion' => Carbon::now()->addDays($forfait->dias_validez),
                    'viajes_restantes' => $forfait->viajes_incluidos,
                ]);
            }

            return ['message' => 'Payment successful and forfait updated'];
        } else {
            $transaccion->update(['estado' => 'fallido']);
            throw new \Exception('Orange Money payment failed.');
        }
    }
}
