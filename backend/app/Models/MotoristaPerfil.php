<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MotoristaPerfil extends Model
{
    protected $table = 'motoristas_perfiles';

    protected $fillable = [
        'usuario_id',
        'marca_vehiculo',
        'matricula',
        'documento_licencia_path',
        'estado_validacion',
        'estado_actual',
        'latitud_actual',
        'longitud_actual',
    ];
}
