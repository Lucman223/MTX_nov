<?php

namespace App\Http\Requests\Viajes;

use Illuminate\Foundation\Http\FormRequest;

class RateClienteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by 'jwt.auth' middleware and controller logic
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'puntuacion' => ['required', 'integer', 'min:1', 'max:5'],
            'comentario' => 'nullable|string|max:500',
        ];
    }
}
