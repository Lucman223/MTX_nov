<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Calificacion
 *
 * [ES] Representa la calificación y comentario otorgado por un cliente tras finalizar un viaje.
 * [FR] Représente la note et le commentaire donnés par un client après la fin d'un voyage.
 *
 * @package App\Models
 */
class Calificacion extends Model
{
    protected $table = 'calificaciones';

    protected $fillable = [
        'viaje_id',
        'motorista_id',
        'cliente_id',
        'calificador_id', // [NEW]
        'calificado_id', // [NEW]
        'puntuacion',
        'comentario',
    ];
}
