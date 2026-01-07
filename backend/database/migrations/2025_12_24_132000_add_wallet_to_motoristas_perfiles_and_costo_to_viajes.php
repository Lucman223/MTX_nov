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
        Schema::table('motoristas_perfiles', function (Blueprint $table) {
            $table->decimal('billetera', 12, 2)->default(0)->after('viajes_prueba_restantes');
        });

        Schema::table('viajes', function (Blueprint $table) {
            $table->decimal('costo', 12, 2)->default(1000)->after('estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('motoristas_perfiles', function (Blueprint $table) {
            $table->dropColumn('billetera');
        });

        Schema::table('viajes', function (Blueprint $table) {
            $table->dropColumn('costo');
        });
    }
};
