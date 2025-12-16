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
        'viajes_prueba_restantes',
    ];

    public function suscripciones()
    {
        return $this->hasMany(SuscripcionMotorista::class, 'motorista_id', 'usuario_id');
    }

    public function activeSubscription()
    {
        return $this->hasOne(SuscripcionMotorista::class, 'motorista_id', 'usuario_id')
            ->where('estado', 'activo')
            ->where('fecha_fin', '>', now())
            ->latest();
    }

    public function hasAccess()
    {
        if ($this->viajes_prueba_restantes > 0) {
            return true;
        }
        return $this->activeSubscription()->exists();
    }
}
