<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Viaje extends Model
{
    protected $fillable = [
        'cliente_id',
        'motorista_id',
        'origen_lat',
        'origen_lng',
        'destino_lat',
        'destino_lng',
        'estado',
        'fecha_solicitud',
        'fecha_fin',
    ];
}
