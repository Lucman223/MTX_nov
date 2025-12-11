<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClienteForfait extends Model
{
    protected $table = 'clientes_forfaits';

    protected $fillable = [
        'cliente_id',
        'forfait_id',
        'fecha_compra',
        'fecha_expiracion',
        'viajes_restantes',
        'estado',
    ];

    public function forfait()
    {
        return $this->belongsTo(Forfait::class, 'forfait_id');
    }

    public function cliente()
    {
        return $this->belongsTo(User::class, 'cliente_id');
    }
}
