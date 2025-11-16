<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClienteForfait extends Model
{
    protected $fillable = [
        'cliente_id',
        'forfait_id',
        'fecha_compra',
        'fecha_expiracion',
        'viajes_restantes',
    ];
}
