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
    public function updateStatus(User $user, string $estadoActual): MotoristaPerfil
    {
        $motoristaPerfil = MotoristaPerfil::where('usuario_id', $user->id)->firstOrFail();
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
        $motoristaPerfil = MotoristaPerfil::where('usuario_id', $user->id)->firstOrFail();
        $motoristaPerfil->update(['estado_validacion' => $estadoValidacion]);
        return $motoristaPerfil;
    }
}
