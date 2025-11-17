<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaccion extends Model
{
    protected $fillable = [
        'cliente_id',
        'forfait_id',
        'monto',
        'moneda',
        'estado',
        'metodo_pago',
        'fecha_transaccion',
    ];
}
