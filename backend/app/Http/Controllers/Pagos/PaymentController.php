<?php

namespace App\Http\Controllers\Pagos;

use App\Http\Controllers\Controller;
use App\Models\Forfait;
use App\Models\Transaccion;
use App\Models\ClienteForfait;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    /**
     * Initiate a payment for a forfait
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
            'referencia_externa' => 'MOCK-' . strtoupper(uniqid()),
            'descripcion' => "Compra de forfait {$forfait->nombre}"
        ]);

        return response()->json([
            'message' => 'Payment initiated successfully',
            'transaction_id' => $transaccion->id,
            'amount' => $forfait->precio,
            'status' => 'pending',
            'payment_url' => "/mock-payment-gateway?ref={$transaccion->referencia_externa}"
        ]);
    }

    /**
     * Verify and confirm a payment (Simulation)
     */
    public function verifyPayment(Request $request)
    {
        $request->validate([
            'transaction_id' => 'required|exists:transacciones,id',
            'status' => 'required|in:success,failed'
        ]);

        $transaccion = Transaccion::findOrFail($request->transaction_id);

        if ($transaccion->estado !== 'pendiente') {
            return response()->json(['message' => 'Transaction already processed'], 400);
        }

        if ($request->status === 'success') {
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
