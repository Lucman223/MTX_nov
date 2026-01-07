<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class SuscripcionMotorista
 *
 * [ES] Asignación de un PlanMotorista a un conductor específico.
 *      Controla la vigencia del plan y el estado de la suscripción.
 *
 * [FR] Attribution d'un PlanMotorista à un chauffeur spécifique.
 *      Contrôle la validité du plan et l'état de l'abonnement.
 *
 * @package App\Models
 */
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
