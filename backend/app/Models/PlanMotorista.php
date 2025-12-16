<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanMotorista extends Model
{
    protected $table = 'planes_motorista';

    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'dias_validez',
        'es_vip',
    ];
}
