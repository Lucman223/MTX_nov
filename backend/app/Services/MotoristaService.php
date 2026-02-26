<?php

namespace App\Services;

use App\Models\User;
use App\Models\MotoristaPerfil;
use App\Events\MotoristaLocationUpdated;

/**
 * Class MotoristaService
 *
 * [ES] Lógica de negocio para el perfil del motorista (actualización de ubicación y estado).
 * [FR] Logique métier pour le profil du motoriste (mise à jour de l'emplacement et de l'état).
 */
class MotoristaService
{
    public function updateStatus(\App\Models\User $user, string $estadoActual): \App\Models\MotoristaPerfil {
        $motoristaPerfil = \App\Models\MotoristaPerfil::where('usuario_id', $user->id)->firstOrFail();
        $motoristaPerfil->update(['estado_actual' => $estadoActual]);
        return $motoristaPerfil;
    }

    public function updateLocation(User $user, float $latitude, float $longitude): MotoristaPerfil
    {
        $motoristaPerfil = MotoristaPerfil::where('usuario_id', $user->id)->firstOrFail();
        $motoristaPerfil->update([
            'latitud_actual' => $latitude,
            'longitud_actual' => $longitude,
        ]);
        event(new MotoristaLocationUpdated($motoristaPerfil));
        return $motoristaPerfil;
    }

    public function updateValidationStatus(User $user, string $estadoValidacion): MotoristaPerfil
    {
        if ($user->rol !== 'motorista') {
            throw new \Exception('User is not a motorista. Profile required.');
        }

        $motoristaPerfil = MotoristaPerfil::where('usuario_id', $user->id)->first();
        
        // [ES] Auto-fix: Si el perfil no existe, lo creamos para que la validación no falle
        if (!$motoristaPerfil) {
            $motoristaPerfil = MotoristaPerfil::create([
                'usuario_id' => $user->id,
                'estado_actual' => 'inactivo',
                'viajes_prueba_restantes' => 5,
                'billetera' => 0,
                // [ES] Campos obligatorios por esquema DB, usamos placeholders
                'marca_vehiculo' => 'Generic',
                'matricula' => 'TEMP-' . $user->id . '-' . time(),
                'documento_licencia_path' => 'pending_upload',
            ]);
            \Illuminate\Support\Facades\Log::info("Auto-created missing profile during validation for driver ID: {$user->id}");
        }

        // [ES] Sincronizamos con el estado de la cuenta principal para que los banners desaparezcan
        $user->update(['status' => $estadoValidacion]);
        
        $motoristaPerfil->update(['estado_validacion' => $estadoValidacion]);
        return $motoristaPerfil;
    }
}
