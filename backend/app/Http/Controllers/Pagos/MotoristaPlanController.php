<?php

namespace App\Http\Controllers\Pagos;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PlanMotorista;
use App\Models\SuscripcionMotorista;
use App\Models\MotoristaPerfil;
use Carbon\Carbon;

class MotoristaPlanController extends Controller
{
    /**
     * [ES] Lista todos los planes disponibles.
     * [FR] Liste tous les plans disponibles.
     */
    public function index()
    {
        $planes = PlanMotorista::orderBy('precio', 'asc')->get();
        return response()->json($planes);
    }

    /**
     * [ES] Obtiene el estado actual de la suscripción del motorista.
     * [FR] Obtient l'état actuel de l'abonnement du chauffeur.
     */
    public function getStatus()
    {
        $user = auth()->user();
        $perfil = MotoristaPerfil::where('usuario_id', $user->id)->first();

        if (!$perfil) {
            return response()->json(['error' => 'Perfil de motorista no encontrado'], 404);
        }

        $activeSubscription = $perfil->activeSubscription()->with('plan')->first();

        return response()->json([
            'acceso_permitido' => $perfil->hasAccess(),
            'viajes_prueba_restantes' => (int)$perfil->viajes_prueba_restantes,
            'suscripcion_activa' => $activeSubscription ? true : false,
            'plan' => $activeSubscription ? $activeSubscription->plan : null,
            'fecha_fin' => $activeSubscription ? $activeSubscription->fecha_fin : null,
            
            // Debug info
            'server_time' => now()->toDateTimeString(),
            'debug_access' => $perfil->hasAccess()
        ]);
    }

    /**
     * [ES] Suscribirse a un plan (Pago Simulado).
     * [FR] S'abonner à un plan (Paiement Simulé).
     */
    public function subscribe(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:planes_motorista,id',
            'payment_method' => 'required|string', // orange_money, moov_money, etc.
            'phone_number' => 'nullable|string',
        ]);

        $user = auth()->user();
        $plan = PlanMotorista::findOrFail($request->plan_id);

        // --- MOCK PAYMENT GATEWAY LOGIC ---
        // Here we would integrate with Orange Money API
        // For now, we assume success after 1 second delay simulation (frontend side)
        
        $transaccionId = 'TXN-' . strtoupper(uniqId()) . '-' . time();

        $subscription = SuscripcionMotorista::create([
            'motorista_id' => $user->id,
            'plan_id' => $plan->id,
            'fecha_inicio' => Carbon::now(),
            'fecha_fin' => Carbon::now()->addDays($plan->dias_validez),
            'estado' => 'activo',
            'transaccion_id' => $transaccionId
        ]);

        return response()->json([
            'message' => '¡Suscripción activada con éxito!',
            'subscription' => $subscription,
            'transaction_id' => $transaccionId
        ], 201);
    }
}
