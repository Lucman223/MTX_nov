<?php

namespace App\Services;

use App\Models\Calificacion;
use App\Models\Viaje;
use App\Models\User;

class CalificacionService
{
    public function rateMotorista(User $user, Viaje $viaje, int $puntuacion, ?string $comentario): Calificacion
    {
        if ($viaje->estado !== 'completado' || $viaje->cliente_id !== $user->id) {
            throw new \Exception('Cannot rate motorista for this trip');
        }

        if (!$viaje->motorista_id) {
            throw new \Exception('No motorista assigned to this trip');
        }

        if (Calificacion::where('viaje_id', $viaje->id)
                        ->where('calificador_id', $user->id)
                        ->where('calificado_id', $viaje->motorista_id)
                        ->where('tipo', 'cliente_a_motorista')
                        ->exists()) {
            throw new \Exception('Motorista already rated for this trip');
        }

        return Calificacion::create([
            'viaje_id' => $viaje->id,
            'calificador_id' => $user->id,
            'calificado_id' => $viaje->motorista_id,
            'puntuacion' => $puntuacion,
            'comentario' => $comentario,
            'tipo' => 'cliente_a_motorista',
        ]);
    }

    public function rateCliente(User $user, Viaje $viaje, int $puntuacion, ?string $comentario): Calificacion
    {
        if ($viaje->estado !== 'completado' || $viaje->motorista_id !== $user->id) {
            throw new \Exception('Cannot rate client for this trip');
        }

        if (Calificacion::where('viaje_id', $viaje->id)
                        ->where('calificador_id', $user->id)
                        ->where('calificado_id', $viaje->cliente_id)
                        ->where('tipo', 'motorista_a_cliente')
                        ->exists()) {
            throw new \Exception('Client already rated for this trip');
        }

        return Calificacion::create([
            'viaje_id' => $viaje->id,
            'calificador_id' => $user->id,
            'calificado_id' => $viaje->cliente_id,
            'puntuacion' => $puntuacion,
            'comentario' => $comentario,
            'tipo' => 'motorista_a_cliente',
        ]);
    }
}
