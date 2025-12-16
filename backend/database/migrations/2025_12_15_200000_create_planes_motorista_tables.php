<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('planes_motorista', function (Blueprint $table) {
            $table->id();
            $table->string('nombre'); // Diario, Semanal, VIP
            $table->text('descripcion')->nullable();
            $table->decimal('precio', 10, 2);
            $table->integer('dias_validez');
            $table->boolean('es_vip')->default(false);
            $table->timestamps();
        });

        Schema::create('suscripciones_motorista', function (Blueprint $table) {
            $table->id();
            $table->foreignId('motorista_id')->constrained('users')->onDelete('cascade'); // Usuario ID del motorista
            $table->foreignId('plan_id')->constrained('planes_motorista');
            $table->dateTime('fecha_inicio');
            $table->dateTime('fecha_fin');
            $table->enum('estado', ['activo', 'expirado', 'cancelado'])->default('activo');
            $table->string('transaccion_id')->nullable(); // ID de Orange Money o similar
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('suscripciones_motorista');
        Schema::dropIfExists('planes_motorista');
    }
};
