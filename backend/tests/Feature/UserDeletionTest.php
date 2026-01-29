<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserDeletionTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test user deletion logic.
     *
     * @return void
     */
    public function test_user_can_delete_account()
    {
        // 1. Create a user
        $user = User::factory()->create([
            'email' => 'tobedeleted@test.com',
            'password' => Hash::make('password'),
            'name' => 'John Doe'
        ]);

        // 2. Authenticate
        $token = JWTAuth::fromUser($user);

        // 3. Make deletion request
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson('/api/profile', [
            'password' => 'password'
        ]);

        // 4. Assert response
        $response->assertStatus(200)
                 ->assertJson(['message' => 'Account deleted successfully']);

        // 5. Assert user is soft deleted in DB
        $this->assertSoftDeleted('users', [
            'id' => $user->id
        ]);

        // 6. Assert anonymization
        $deletedUser = User::withTrashed()->find($user->id);
        
        $this->assertStringStartsWith('Deleted User', $deletedUser->name);
        $this->assertStringStartsWith('deleted_', $deletedUser->email);
        $this->assertNull($deletedUser->telefono);
        $this->assertNotEquals('John Doe', $deletedUser->name);
        $this->assertFalse(Hash::check('password', $deletedUser->password));
    }

    public function test_user_cannot_delete_account_with_wrong_password()
    {
        $user = User::factory()->create();
        $token = JWTAuth::fromUser($user);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson('/api/profile', [
            'password' => 'wrong-password'
        ]);

        $response->assertStatus(422);
    }
}
