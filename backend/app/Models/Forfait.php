<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Forfait extends Model
{
    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'viajes_incluidos',
        'dias_validez',
        'estado',
    ];
}
