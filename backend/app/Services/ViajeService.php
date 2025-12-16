<?php

namespace App\Services;

use App\Models\Viaje;
use App\Models\ClienteForfait;
use App\Models\User;
use Carbon\Carbon;
use App\Models\MotoristaPerfil;

class ViajeService
{
    public function solicitarViaje(User $user, float $origen_lat, float $origen_lng, ?float $destino_lat = null, ?float $destino_lng = null): Viaje
    {
        // Check for Forfait
        $clienteForfait = ClienteForfait::where('cliente_id', $user->id)
            ->where('viajes_restantes', '>', 0)
            ->where('fecha_expiracion', '>', Carbon::now())
            ->first();

        // For now, if no forfait, we might throw error, OR allow Pay-Per-Ride pending implementation.
        // Sticking to strict forfait for now as per logic, but adding logging.
        if (!$clienteForfait) {
             throw new \Exception('No active forfait. Please purchase a plan.');
        }

        $viaje = Viaje::create([
            'cliente_id' => $user->id,
            'origen_lat' => $origen_lat,
            'origen_lng' => $origen_lng,
            'destino_lat' => $destino_lat,
            'destino_lng' => $destino_lng,
            'estado' => 'solicitado',
        ]);

        $clienteForfait->decrement('viajes_restantes');

        return $viaje;
    }

    public function acceptTrip(User $motorista, Viaje $viaje): Viaje
    {
        if ($motorista->rol !== 'motorista') {
            throw new \Exception('Forbidden: Only motoristas can accept trips');
        }

        $motoristaPerfil = MotoristaPerfil::where('usuario_id', $motorista->id)->first();
        if (!$motoristaPerfil || $motoristaPerfil->estado_actual !== 'activo') {
            throw new \Exception('Motorista is not active or profile not found');
        }

        if ($viaje->estado !== 'solicitado' || $viaje->motorista_id !== null) {
            throw new \Exception('Trip is not available for acceptance');
        }

        $viaje->update([
            'motorista_id' => $motorista->id,
            'estado' => 'aceptado',
        ]);

        return $viaje;
    }

    public function updateTripStatus(User $motorista, Viaje $viaje, string $newStatus): Viaje
    {
        if ($viaje->motorista_id !== $motorista->id) {
            throw new \Exception('Forbidden: You are not assigned to this trip');
        }

        $currentStatus = $viaje->estado;

        $validTransitions = [
            'aceptado' => ['en_curso', 'cancelado'],
            'en_curso' => ['completado', 'cancelado'],
        ];

        if (!isset($validTransitions[$currentStatus]) || !in_array($newStatus, $validTransitions[$currentStatus])) {
            throw new \Exception("Invalid state transition from {$currentStatus} to {$newStatus}");
        }

        $updateData = ['estado' => $newStatus];

        if ($newStatus === 'completado') {
            $updateData['fecha_fin'] = Carbon::now();

            // Decrement trial trips if applicable
            $perfil = MotoristaPerfil::where('usuario_id', $motorista->id)->first();
            if ($perfil) {
                $hasSubscription = $perfil->activeSubscription()->exists();
                if (!$hasSubscription && $perfil->viajes_prueba_restantes > 0) {
                    $perfil->decrement('viajes_prueba_restantes');
                }
            }
        }

        $viaje->update($updateData);

        return $viaje;
    }
}
