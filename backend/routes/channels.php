<?php

use App\Models\Viaje;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('viaje.{viajeId}', function ($user, $viajeId) {
    // Find the trip by its ID
    $viaje = Viaje::find($viajeId);

    // If the trip doesn't exist, deny authorization
    if (!$viaje) {
        return false;
    }

    // Allow access if the user is the client or the motorista for the trip
    return $user->id === $viaje->cliente_id || $user->id === $viaje->motorista_id;
});

Broadcast::channel('viajes.disponibles', function ($user) {
    return $user->rol === 'motorista' && $user->motorista_perfil?->estado_validacion === 'aprobado';
});
