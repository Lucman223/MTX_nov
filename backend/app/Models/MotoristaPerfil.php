<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MotoristaPerfil extends Model
{
    protected $fillable = [
        'usuario_id',
        'marca_vehiculo',
        'matricula',
        'documento_licencia_path',
        'estado_validacion',
        'estado_actual',
        'current_lat', // New field
        'current_lng', // New field
    ];
}
