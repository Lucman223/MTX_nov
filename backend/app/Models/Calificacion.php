<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Calificacion extends Model
{
    protected $fillable = [
        'viaje_id',
        'calificador_id',
        'calificado_id',
        'puntuacion',
        'comentario',
        'tipo',
    ];
}
