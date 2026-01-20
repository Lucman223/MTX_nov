<?php

namespace App\Http\Controllers\User;

use App\Models\MotoristaPerfil;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Events\MotoristaLocationUpdated; // Import the event
use App\Http\Requests\User\UpdateMotoristaStatusRequest;
use App\Http\Requests\User\UpdateMotoristaLocationRequest;
use App\Services\MotoristaService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Controllers\Controller;

/**
 * Class MotoristaController
 *
 * [ES] Controlador para la gestión del perfil del motorista (estado y ubicación).
 *      Permite al conductor actualizar su disponibilidad y coordenadas en tiempo real.
 *
 * [FR] Contrôleur pour la gestion du profil du chauffeur (état et emplacement).
 *      Permet au conducteur de mettre à jour sa disponibilité et ses coordonnées en temps réel.
 */
class MotoristaController extends Controller
{
    protected $motoristaService;

    public function __construct(MotoristaService $motoristaService)
    {
        $this->motoristaService = $motoristaService;
    }
    public function updateStatus(UpdateMotoristaStatusRequest $request)
    {
        $user = auth()->user();

        if ($user->rol !== 'motorista') {
            return response()->json(['error' => 'Forbidden: Only motoristas can update their status'], 403);
        }

        try {
            $motoristaPerfil = $this->motoristaService->updateStatus($user, $request->estado_actual);
            return response()->json([
                'message' => 'Motorista status updated successfully',
                'data' => $motoristaPerfil,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Motorista profile not found'], 404);
        }
    }

    public function updateLocation(UpdateMotoristaLocationRequest $request)
    {
        $user = auth()->user();

        if ($user->rol !== 'motorista') {
            return response()->json(['error' => 'Forbidden: Only motoristas can update their location'], 403);
        }

        try {
            $motoristaPerfil = $this->motoristaService->updateLocation($user, $request->latitude, $request->longitude);
            return response()->json([
                'message' => 'Motorista location updated successfully',
                'data' => $motoristaPerfil,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Motorista profile not found'], 404);
        }
    }

    /**
     * [ES] Recupera el perfil completo del motorista, incluyendo el saldo de la billetera.
     */
    public function getProfile()
    {
        $user = auth()->user();
        $perfil = MotoristaPerfil::where('usuario_id', $user->id)->firstOrFail();
        return response()->json($perfil);
    }

    /**
     * [ES] Permite al motorista retirar sus ganancias acumuladas.
     *      Crea una transacción y resta el monto de la billetera.
     */
    public function withdraw(Request $request)
    {
        $user = auth()->user();
        $perfil = MotoristaPerfil::where('usuario_id', $user->id)->firstOrFail();

        $request->validate([
            'monto' => 'required|numeric|min:100', // Mínimo retiro 100 CFA
        ]);

        if ($perfil->billetera < $request->monto) {
            return response()->json(['error' => 'Saldo insuficiente'], 400);
        }

        // 1. Descontar del saldo
        $perfil->decrement('billetera', $request->monto);

        // 2. Registrar transacción
        \App\Models\Transaccion::create([
            'usuario_id' => $user->id,
            'monto' => $request->monto,
            'tipo' => 'retiro_saldo',
            'estado' => 'completado', // En un sistema real sería 'en_proceso'
            'metodo_pago' => 'Orange Money',
            'descripcion' => 'Retiro de ganancias diarias',
            'fecha_transaccion' => now(),
        ]);

        return response()->json([
            'message' => 'Retiro procesado con éxito',
            'nuevo_saldo' => $perfil->billetera,
        ]);
    }

    /**
     * Get transaction history for current motorista
     */
    public function getTransactions() {
        $user = auth()->user();
        $transactions = \App\Models\Transaccion::where('usuario_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();
            
        return response()->json($transactions);
    }

    /**
     * [ES] Actualiza la información específica del motorista (vehículo).
     */
    public function updateMotoristaProfile(Request $request)
    {
        $user = auth()->user();
        $perfil = \App\Models\MotoristaPerfil::where('usuario_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'marca_vehiculo' => 'sometimes|string|max:255',
            'matricula'      => 'sometimes|string|max:255|unique:motoristas_perfiles,matricula,' . $perfil->id,
            'modelo_moto'    => 'sometimes|string|max:255',
            'anio_moto'      => 'sometimes|string|max:4',
            'color_moto'     => 'sometimes|string|max:50',
        ]);

        $perfil->update($validated);

        return response()->json([
            'message' => 'Perfil de motorista actualizado correctamente',
            'perfil'  => $perfil
        ]);
    }
}
