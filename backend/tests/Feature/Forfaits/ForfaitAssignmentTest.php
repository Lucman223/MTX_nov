<?php

namespace Tests\Feature\Forfaits;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Forfait;
use App\Models\ClienteForfait;

class ForfaitAssignmentTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that a forfait can be created.
     */
    public function test_forfait_can_be_created(): void
    {
        $forfait = Forfait::create([
            'nombre' => 'Pack Test',
            'precio' => 1000,
            'viajes_incluidos' => 5,
            'dias_validez' => 30
        ]);

        $this->assertDatabaseHas('forfaits', [
            'nombre' => 'Pack Test',
            'viajes_incluidos' => 5
        ]);
    }

    /**
     * Test assigning a forfait to a user.
     */
    public function test_user_can_receive_forfait(): void
    {
        $user = User::factory()->create();
        $forfait = Forfait::create([
            'nombre' => 'Pack Pro',
            'precio' => 5000,
            'viajes_incluidos' => 10,
            'dias_validez' => 30
        ]);

        ClienteForfait::create([
            'cliente_id' => $user->id,
            'forfait_id' => $forfait->id,
            'viajes_restantes' => 10,
            'fecha_compra' => now(),
            'fecha_expiracion' => now()->addDays(30)
        ]);

        $this->assertDatabaseHas('cliente_forfaits', [
            'cliente_id' => $user->id,
            'forfait_id' => $forfait->id,
            'viajes_restantes' => 10
        ]);
    }
}
