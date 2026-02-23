<?php

namespace App\Http\Controllers\Pagos;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Requests\Pagos\BuyForfaitRequest;
use App\Services\ForfaitService;

/**
 * Class ClienteForfaitController
 *
 * [ES] Gestiona la compra y verificación de forfaits (planes de suscripción) por parte de los clientes.
 * [FR] Gère l'achat et la vérification des forfaits (plans d'abonnement) par les clients.
 */
class ClienteForfaitController extends Controller
{
    protected $orangeMoneyService;

    public function __construct(ForfaitService $forfaitService, \App\Services\OrangeMoneyService $orangeMoneyService)
    {
        $this->forfaitService = $forfaitService;
        $this->orangeMoneyService = $orangeMoneyService;
    }

    /**
     * [ES] Lista los forfaits activos disponibles.
     * [FR] Liste les forfaits actifs disponibles.
     */
    public function index()
    {
        // Use Forfait model directly or Service
        return \App\Models\Forfait::where('estado', 'activo')->get();
    }

    /**
     * [ES] Inicia el proceso de compra de un forfait.
     * [FR] Initie le processus d'achat d'un forfait.
     */
    public function buyForfait(BuyForfaitRequest $request)
    {
        $user = auth()->user();
        $forfaitId = $request->forfait_id;
        $phone = $request->input('phone_number', '00000000');
        
        $forfait = \App\Models\Forfait::findOrFail($forfaitId);
        $amount = $forfait->precio;

        return \Illuminate\Support\Facades\DB::transaction(function () use ($user, $forfait, $phone, $amount) {
            try {
                // [ES] 1. Iniciar Pago (Simulado o Real)
                $paymentInit = $this->orangeMoneyService->initiatePayment($phone, $amount);
                $orderId = $paymentInit['order_id'] ?? 'TRX-' . \Illuminate\Support\Str::random(10);

                // [ES] 2. Registrar transacción en estado INICIADO para idempotencia
                \App\Models\Transaccion::create([
                    'usuario_id' => $user->id,
                    'forfait_id' => $forfait->id,
                    'monto' => $amount,
                    'moneda' => 'CFA',
                    'tipo' => 'compra_forfait',
                    'estado' => 'iniciado',
                    'pasarela_pago_id' => $orderId,
                    'metodo_pago' => 'Orange Money',
                    'descripcion' => "Compra de Forfait: {$forfait->nombre}",
                    'fecha_transaccion' => now(),
                ]);

                return response()->json([
                    'message' => 'Payment initiated. Please confirm on your mobile.',
                    'order_id' => $orderId,
                    'status' => 'pending'
                ]);

            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 400);
            }
        });
    }

    /**
     * [ES] Verifica el estado de una transacción y finaliza la compra si es exitosa.
     * [FR] Vérifie l'état d'une transaction et finalise l'achat si elle est réussie.
     */
    public function checkStatus(Request $request)
    {
        $request->validate([
            'order_id' => 'required',
            'forfait_id' => 'required|exists:forfaits,id'
        ]);

        return \Illuminate\Support\Facades\DB::transaction(function () use ($request) {
            // [ES] Bloqueo pesimista sobre la transacción para evitar doble asignación
            $transaccion = \App\Models\Transaccion::where('pasarela_pago_id', $request->order_id)
                ->where('usuario_id', auth()->id())
                ->lockForUpdate()
                ->first();

            if (!$transaccion) {
                return response()->json(['error' => 'Transaction not found'], 404);
            }

            // [ES] Idempotencia: Si ya está completada, devolvemos éxito directamente
            if ($transaccion->estado === 'completado') {
                return response()->json([
                    'status' => 'SUCCESS',
                    'message' => 'Forfait already activated',
                ]);
            }

            try {
                // [ES] Verificar Estado con Pasarela
                $statusData = $this->orangeMoneyService->checkStatus($request->order_id);

                if (isset($statusData['status']) && strtoupper($statusData['status']) === 'SUCCESS') {
                    $user = auth()->user();
                    
                    // [ES] Finalizar Compra y actualizar transacción
                    $clienteForfait = $this->forfaitService->buyForfait($user, $request->forfait_id);
                    
                    $transaccion->update(['estado' => 'completado']);

                    return response()->json([
                        'status' => 'SUCCESS',
                        'message' => 'Payment confirmed and Forfait activated',
                        'data' => $clienteForfait
                    ]);
                }

                return response()->json([
                    'status' => 'PENDING',
                    'message' => 'Waiting for confirmation...'
                ]);

            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 400);
            }
        });
    }
}
