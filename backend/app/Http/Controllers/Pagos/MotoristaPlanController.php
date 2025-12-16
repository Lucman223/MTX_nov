<?php

namespace App\Http\Controllers\Pagos;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PlanMotorista;
use App\Models\SuscripcionMotorista;
use Illuminate\Support\Facades\Auth;
use App\Services\OrangeMoneyService; // Mock service we already have

class MotoristaPlanController extends Controller
{
    protected $orangeMoney;

    public function __construct(OrangeMoneyService $orangeMoney)
    {
        $this->orangeMoney = $orangeMoney;
    }

    public function index()
    {
        $planes = PlanMotorista::all();
        \Illuminate\Support\Facades\Log::info('PlanMotorista index called. Count: ' . $planes->count());
        return response()->json($planes);
    }

    public function getStatus()
    {
        $user = Auth::user();
        if ($user->rol !== 'motorista') {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $perfil = \App\Models\MotoristaPerfil::where('usuario_id', $user->id)->first();
        $subscription = $perfil->activeSubscription;

        return response()->json([
            'suscripcion_activa' => $subscription ? true : false,
            'plan' => $subscription ? $subscription->plan : null,
            'fecha_fin' => $subscription ? $subscription->fecha_fin : null,
            'viajes_prueba_restantes' => $perfil->viajes_prueba_restantes,
            'acceso_permitido' => $perfil->hasAccess()
        ]);
    }

    public function subscribe(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:planes_motorista,id',
            'phone' => 'required',
            // 'code_otp' => 'required' (Si fuera real)
        ]);

        $user = Auth::user();
        $plan = PlanMotorista::find($request->plan_id);

        // 1. Procesar Pago (Simulado)
        $paymentResult = $this->orangeMoney->processPayment($user, $plan->precio, $request->phone);

        if (!$paymentResult['success']) {
            return response()->json(['message' => 'El pago falló'], 400);
        }

        // 2. Crear Suscripción
        $suscripcion = SuscripcionMotorista::create([
            'motorista_id' => $user->id,
            'plan_id' => $plan->id,
            'fecha_inicio' => now(),
            'fecha_fin' => now()->addDays($plan->dias_validez),
            'estado' => 'activo',
            'transaccion_id' => $paymentResult['transaction_id']
        ]);

        return response()->json([
            'message' => 'Suscripción realizada con éxito',
            'suscripcion' => $suscripcion
        ]);
    }
}
