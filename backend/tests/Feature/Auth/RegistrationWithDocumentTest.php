<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class RegistrationWithDocumentTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_with_identity_document()
    {
        Storage::fake('public');

        $document = UploadedFile::fake()->create('dni.pdf', 100);

        $response = $this->postJson('/api/auth/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'rol' => 'cliente',
            'telefono' => '12345678',
            'documento_identidad' => $document,
        ]);

        $response->assertStatus(201);
        
        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
            'name' => 'John Doe',
            'rol' => 'cliente',
        ]);

        $user = User::where('email', 'john@example.com')->first();
        $this->assertNotNull($user->documento_identidad_path);
        
        Storage::disk('public')->assertExists($user->documento_identidad_path);
    }

    public function test_registration_fails_without_identity_document()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'rol' => 'cliente',
            'telefono' => '12345678',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['documento_identidad']);
    }

    public function test_registration_fails_with_invalid_file_type()
    {
        Storage::fake('public');

        $document = UploadedFile::fake()->create('doc.txt', 100);

        $response = $this->postJson('/api/auth/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'rol' => 'cliente',
            'telefono' => '12345678',
            'documento_identidad' => $document,
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['documento_identidad']);
    }
}
