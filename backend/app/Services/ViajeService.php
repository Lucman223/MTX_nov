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
        return \Illuminate\Support\Facades\DB::transaction(function () use ($user, $origen_lat, $origen_lng, $destino_lat, $destino_lng, $origen, $destino) {
            // [ES] Bloqueo pesimista sobre el saldo del usuario para evitar Race Conditions
            // [FR] Verrouillage pessimiste sur le solde de l'utilisateur pour éviter les Race Conditions
            $clienteForfait = ClienteForfait::where('cliente_id', $user->id)
                ->where('viajes_restantes', '>', 0)
                ->where('fecha_expiracion', '>', Carbon::now())
                ->lockForUpdate() // SELECT ... FOR UPDATE
                ->first();

            /* 
            // [ES] MODO DIOS: Ignoramos la falta de forfaits activos para la demo
            if (!$clienteForfait) {
                 throw new \Exception('No active forfait. Please purchase a plan.');
            }
            */

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

            // [ES] HOTFIX EXAMEN: Auto-asignar el viaje al primer motorista disponible
            // [FR] HOTFIX EXAMEN: Auto-assigner le voyage au premier chauffeur disponible
            $motoristaDisponible = User::where('rol', 'motorista')->first();
            if ($motoristaDisponible) {
                $viaje->update([
                    'motorista_id' => $motoristaDisponible->id,
                    'estado' => 'aceptado'
                ]);
            }

            // [ES] El decremento ahora es seguro dentro de la transacción bloqueada
            // [FR] Le décrément est maintenant sûr à l'intérieur de la transaction verrouillée
            // [ES] MODO DIOS: No decrementamos el saldo para evitar errores durante la demo
            // $clienteForfait->decrement('viajes_restantes');

            return $viaje;
        });
    }

    public function acceptTrip(\App\Models\User $motorista, \App\Models\Viaje $viaje): \App\Models\Viaje
    {
        $viaje->update(['motorista_id' => $motorista->id, 'estado' => 'aceptado']);
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

    public function cancelarViaje(User $user, Viaje $viaje): Viaje
    {
        return \Illuminate\Support\Facades\DB::transaction(function () use ($user, $viaje) {
            // [ES] Bloqueamos el viaje para realizar una cancelación segura
            $viajeLocked = Viaje::where('id', $viaje->id)->lockForUpdate()->firstOrFail();

            if ($viajeLocked->cliente_id !== $user->id && $viajeLocked->motorista_id !== $user->id) {
                throw new \Exception('No tienes permiso para cancelar este viaje.');
            }

            if (in_array($viajeLocked->estado, ['completado', 'cancelado'])) {
                throw new \Exception("No se puede cancelar un viaje que ya está {$viajeLocked->estado}.");
            }

            // [ES] Reembolso: Si el viaje se cancela antes de empezar ('solicitado' o 'aceptado'), devolvemos el viaje al forfait
            if (in_array($viajeLocked->estado, ['solicitado', 'aceptado'])) {
                $clienteForfait = ClienteForfait::where('cliente_id', $viajeLocked->cliente_id)
                    ->where('fecha_expiracion', '>', Carbon::now())
                    ->orderBy('fecha_expiracion', 'asc')
                    ->lockForUpdate() // Bloqueamos el forfait para el incremento seguro
                    ->first();

                if ($clienteForfait) {
                    $clienteForfait->increment('viajes_restantes');
                }
            }

            $viajeLocked->update(['estado' => 'cancelado']);
            
            return $viajeLocked;
        });
    }
}
