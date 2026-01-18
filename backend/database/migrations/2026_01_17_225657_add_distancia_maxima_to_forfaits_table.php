<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('forfaits', function (Blueprint $table) {
            $table->decimal('distancia_maxima', 8, 2)->default(0)->after('viajes_incluidos')->comment('Distancia máxima en KM permitida por viaje. 0 = Ilimitado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('forfaits', function (Blueprint $table) {
            $table->dropColumn('distancia_maxima');
        });
    }
};
