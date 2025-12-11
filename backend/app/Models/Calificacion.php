<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Calificacion extends Model
{
    protected $table = 'calificaciones';

    protected $fillable = [
        'viaje_id',
        'motorista_id',
        'cliente_id',
        'puntuacion',
        'comentario',
    ];
}
