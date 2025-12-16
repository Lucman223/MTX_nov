<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuscripcionMotorista extends Model
{
    protected $table = 'suscripciones_motorista';

    protected $fillable = [
        'motorista_id',
        'plan_id',
        'fecha_inicio',
        'fecha_fin',
        'estado',
        'transaccion_id',
    ];

    protected $casts = [
        'fecha_inicio' => 'datetime',
        'fecha_fin' => 'datetime',
    ];

    public function plan()
    {
        return $this->belongsTo(PlanMotorista::class, 'plan_id');
    }

    public function motorista()
    {
        return $this->belongsTo(User::class, 'motorista_id');
    }
}
