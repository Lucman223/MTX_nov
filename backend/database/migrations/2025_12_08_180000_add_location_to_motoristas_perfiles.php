<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('motoristas_perfiles', function (Blueprint $table) {
            $table->decimal('latitud_actual', 10, 8)->nullable();
            $table->decimal('longitud_actual', 11, 8)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('motoristas_perfiles', function (Blueprint $table) {
            $table->dropColumn(['latitud_actual', 'longitud_actual']);
        });
    }
};
