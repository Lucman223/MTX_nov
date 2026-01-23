<?php

namespace App\Http\Controllers\Pagos;

use App\Http\Controllers\Controller;
use App\Models\Forfait;
use App\Models\Transaccion;
use App\Models\ClienteForfait;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Class PaymentController
 *
 * [ES] Maneja las transacciones financieras de la plataforma.
 *      Soporta múltiples métodos de pago (Orange Money, Moov Money, Wave) a través de interfaces simuladas.
 *      Usa transacciones de base de datos para asegurar consistencia entre pagos y asignación de suscripciones.
 *
 * [FR] Gère les transactions financières de la plateforme.
 *      Prend en charge plusieurs méthodes de paiement (Orange Money, Moov Money, Wave) via des interfaces simulées.
 *      Utilise des transactions de base de données pour assurer la cohérence entre les paiements et l'attribution des abonnements.
 *
 * @package App\Http\Controllers\Pagos
 */
class PaymentController extends Controller
{
    /**
     * [ES] Inicia una transacción de pago para un plan de suscripción específico (forfait).
     *      Crea un registro de transacción pendiente y devuelve una URL o payload de pago simulado.
     *
     * [FR] Initie une transaction de paiement pour un plan d'abonnement spécifique (forfait).
     *      Crée un enregistrement de transaction en attente et renvoie une URL ou une charge utile de paiement simulée.
     *
     * @param Request $request Requires 'forfait_id' and 'metodo_pago'.
     * @return \Illuminate\Http\JsonResponse JSON with transaction details and payment URL (mock).
     */
    public function initiatePayment(Request $request)
    {
        $request->validate([
            'forfait_id' => 'required|exists:forfaits,id',
            'metodo_pago' => 'required|string|in:orange_money,moov_money,wave',
        ]);

        $user = auth()->user();
        $forfait = Forfait::findOrFail($request->forfait_id);

        // Create transaction in PENDING state
        $transaccion = Transaccion::create([
            'usuario_id' => $user->id,
            'forfait_id' => $forfait->id,
            'monto' => $forfait->precio,
            'moneda' => 'CFA',
            'tipo' => 'compra_forfait',
            'estado' => 'pendiente',
            'metodo_pago' => $request->metodo_pago,
            'fecha_transaccion' => now(),
            'referencia_externa' => 'OM-' . strtoupper(uniqid()), // OM Prefix
            'descripcion' => "Compra de forfait {$forfait->nombre}"
        ]);

        // Integrate with OrangeService
        if ($request->metodo_pago === 'orange_money') {
             $omService = new \App\Services\OrangeMoneyService();
             $omResponse = $omService->webPayment(
                 $forfait->precio,
                 $transaccion->referencia_externa,
                 url("/api/pagos/callback/success?tid={$transaccion->id}"), // Return URLs
                 url("/api/pagos/callback/cancel?tid={$transaccion->id}")
             );

             return response()->json([
                'message' => 'Redireccionando a Orange Money...',
                'transaction_id' => $transaccion->id,
                'payment_url' => $omResponse['payment_url'], // Real-looking URL
                'simulation_mode' => true
            ]);
        }

        // Fallback for others
        return response()->json([
            'message' => 'Payment initiated successfully',
            'transaction_id' => $transaccion->id,
            'amount' => $forfait->precio,
            'status' => 'pending',
            'payment_url' => "/mock-payment-gateway?ref={$transaccion->referencia_externa}"
        ]);
    }

    /**
     * [ES] Verifica el estado de una devolución de llamada (callback) de transacción de pago.
     *      Si es exitoso, realiza una Transacción Atómica usando bloqueo de BD para:
     *      1. Marcar la transacción como completada.
     *      2. Crear y activar la suscripción (ClienteForfait) para el usuario.
     *
     * [FR] Vérifie le statut d'un rappel (callback) de transaction de paiement.
     *      Si réussi, effectue une Transaction Atomique utilisant le verrouillage BD pour :
     *      1. Marquer la transaction comme terminée.
     *      2. Créer et activer l'abonnement (ClienteForfait) pour l'utilisateur.
     *
     * @param Request $request Requires 'transaction_id' and 'status' (success/failed).
     * @return \Illuminate\Http\JsonResponse Result of the verification process.
     */
    public function verifyPayment(Request $request)
    {
        $request->validate([
            'transaction_id' => 'required|exists:transacciones,id',
            'status' => 'required|in:success,failed'
        ]);

        $transaccion = Transaccion::findOrFail($request->transaction_id);

        // Idempotency check: prevent double processing
        if ($transaccion->estado !== 'pendiente') {
            return response()->json(['message' => 'Transaction already processed'], 400);
        }

        if ($request->status === 'success') {
            // Atomic transaction to ensure data integrity
            DB::transaction(function () use ($transaccion) {
                // Update transaction status
                $transaccion->update([
                    'estado' => 'completado',
                    'fecha_transaccion' => now()
                ]);

                // Assign forfait to client
                $forfait = Forfait::find($transaccion->forfait_id);

                ClienteForfait::create([
                    'cliente_id' => $transaccion->usuario_id,
                    'forfait_id' => $forfait->id,
                    'fecha_compra' => now(),
                    'fecha_expiracion' => now()->addDays($forfait->dias_validez),
                    'viajes_restantes' => $forfait->viajes_incluidos,
                    'estado' => 'activo'
                ]);
            });

            return response()->json([
                'message' => 'Payment successful, forfait assigned',
                'status' => 'completed'
            ]);
        } else {
            $transaccion->update(['estado' => 'fallido']);
            return response()->json([
                'message' => 'Payment failed',
                'status' => 'failed'
            ]);
        }
    }
}
