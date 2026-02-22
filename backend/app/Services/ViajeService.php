<?php

namespace App\Services;

use App\Models\Viaje;
use App\Models\ClienteForfait;
use App\Models\User;
use Carbon\Carbon;
use App\Models\MotoristaPerfil;

class ViajeService
{
    public function solicitarViaje(User $user, float $origen_lat, float $origen_lng, ?float $destino_lat = null, ?float $destino_lng = null, ?string $origen = null, ?string $destino = null): Viaje
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
            'origen' => $origen,
            'destino' => $destino,
            'estado' => 'solicitado',
        ]);

        $clienteForfait->decrement('viajes_restantes');

        return $viaje;
    }

    public function acceptTrip(User $motorista, Viaje $viaje): Viaje
    {
        if ($motorista->rol !== 'motorista') {
            throw new \Exception('[ES] Prohibido: Solo motoristas pueden aceptar viajes [FR] Interdit: Seuls les motoristes peuvent accepter des voyages');
        }

        $motoristaPerfil = MotoristaPerfil::where('usuario_id', $motorista->id)->first();
        if (!$motoristaPerfil || $motoristaPerfil->estado_actual !== 'activo') {
            throw new \Exception('[ES] Motorista no activo o perfil no encontrado [FR] Motoriste non actif ou profil introuvable');
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
        if ($viaje->motorista_id != $motorista->id) {
            throw new \Exception('Forbidden: You are not assigned to this trip');
        }

        $currentStatus = $viaje->estado;

        $validTransitions = [
            'aceptado' => ['en_curso', 'cancelado'],
            'en_curso' => ['completado', 'cancelado'],
        ];

        if (!isset($validTransitions[$currentStatus]) || !in_array($newStatus, $validTransitions[$currentStatus])) {
            throw new \Exception("[ES] Transición de estado inválida de {$currentStatus} a {$newStatus} [FR] Transition d'état invalide de {$currentStatus} à {$newStatus}");
        }

        $updateData = ['estado' => $newStatus];

        if ($newStatus === 'completado') {
            $updateData['fecha_fin'] = Carbon::now();

            // Decrement trial trips if applicable
            $perfil = MotoristaPerfil::where('usuario_id', $motorista->id)->first();
            if ($perfil) {
                // Add trip cost to wallet
                $perfil->increment('billetera', $viaje->costo);

                // Register financial transaction for the driver
                \App\Models\Transaccion::create([
                    'usuario_id' => $motorista->id,
                    'monto' => $viaje->costo,
                    'tipo' => 'pago_viaje',
                    'estado' => 'completado',
                    'metodo_pago' => 'MotoTX Wallet',
                    'descripcion' => "Ganancia por viaje #{$viaje->id}",
                    'fecha_transaccion' => now(),
                    'moneda' => 'CFA'
                ]);

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
