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
        $phone = $request->input('phone_number', '00000000');
        
        // [ES] 1. Obtener precio del Forfait (En app real, obtener de BD)
        // [FR] 1. Obtenir le prix du Forfait (Dans une vraie application, récupérer depuis la BD)
        // For demo, we trust the ID exists because of validation, but we should fetch price.
        $amount = 5000; // Placeholder, ideally $forfait->price

        try {
            // [ES] 2. Iniciar Pago (Simulado o Real)
            // [FR] 2. Initier le Paiement (Simulé ou Réel)
            $paymentInit = $this->orangeMoneyService->initiatePayment($phone, $amount);

            // [ES] 3. Retornar estado Pendiente
            // [FR] 3. Retourner l'état En attente
            return response()->json([
                'message' => 'Payment initiated. Please confirm on your mobile.',
                'order_id' => $paymentInit['order_id'] ?? null,
                'pay_token' => $paymentInit['pay_token'] ?? null,
                'status' => 'pending'
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * [ES] Verifica el estado de una transacción y finaliza la compra si es exitosa.
     * [FR] Vérifie l'état d'une transaction et finalise l'achat si elle est réussie.
     */
    public function checkStatus(Request $request)
    {
        $request->validate([
            'order_id' => 'required',
            'forfait_id' => 'required|exists:forfaits,id' // Needed to finalize purchase
        ]);

        try {
            // [ES] 1. Verificar Estado
            // [FR] 1. Vérifier le Statut
            $statusData = $this->orangeMoneyService->checkStatus($request->order_id);

            if (isset($statusData['status']) && strtoupper($statusData['status']) === 'SUCCESS') {
                // [ES] 2. Finalizar Compra (evitar doble asignación si ya se hizo)
                // [FR] 2. Finaliser l'Achat (éviter la double attribution si déjà fait)
                
                $user = auth()->user();
                $clienteForfait = $this->forfaitService->buyForfait($user, $request->forfait_id);

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
    }
}
