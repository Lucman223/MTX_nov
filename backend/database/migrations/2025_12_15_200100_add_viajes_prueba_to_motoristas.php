<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('motoristas_perfiles', function (Blueprint $table) {
            $table->integer('viajes_prueba_restantes')->default(25)->after('estado_actual');
        });
    }

    public function down(): void
    {
        Schema::table('motoristas_perfiles', function (Blueprint $table) {
            $table->dropColumn('viajes_prueba_restantes');
        });
    }
};
