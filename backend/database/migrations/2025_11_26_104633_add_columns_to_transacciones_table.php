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
        Schema::table('transacciones', function (Blueprint $table) {
            $table->foreignId('forfait_id')->nullable()->constrained('forfaits')->onDelete('set null');
            $table->string('moneda', 10)->nullable()->after('monto');
            $table->enum('estado', ['pendiente', 'iniciado', 'completado', 'fallido'])->default('pendiente')->after('tipo');
            $table->string('metodo_pago')->nullable()->after('pasarela_pago_id');
            $table->timestamp('fecha_transaccion')->nullable()->after('descripcion');
            $table->string('referencia_externa')->nullable()->after('pasarela_pago_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transacciones', function (Blueprint $table) {
            $table->dropForeign(['forfait_id']);
            $table->dropColumn(['forfait_id', 'moneda', 'estado', 'metodo_pago', 'fecha_transaccion', 'referencia_externa']);
        });
    }
};
