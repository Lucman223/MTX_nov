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
        Schema::create('viajes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('motorista_id')->nullable()->constrained('users')->onDelete('set null');
            $table->decimal('origen_lat', 10, 7);
            $table->decimal('origen_lng', 10, 7);
            $table->decimal('destino_lat', 10, 7)->nullable();
            $table->decimal('destino_lng', 10, 7)->nullable();
            $table->enum('estado', ['solicitado', 'aceptado', 'en_curso', 'completado', 'cancelado'])->default('solicitado');
            $table->timestamp('fecha_solicitud')->useCurrent();
            $table->timestamp('fecha_fin')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('viajes');
    }
};
