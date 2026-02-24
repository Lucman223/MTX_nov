<?php

namespace App\Http\Controllers\Admin;

use App\Models\PlanMotorista;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AdminPlanMotoristaController extends Controller
{
    public function index()
    {
        return PlanMotorista::orderBy('precio', 'asc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'precio' => 'required|numeric|min:0',
            'dias_validez' => 'required|integer|min:1',
            'es_vip' => 'required|boolean',
        ]);

        $plan = PlanMotorista::create($validated);

        return response()->json($plan, 201);
    }

    public function show(PlanMotorista $plan)
    {
        return $plan;
    }

    public function update(Request $request, PlanMotorista $plan)
    {
        $validated = $request->validate([
            'nombre' => 'sometimes|required|string|max:255',
            'descripcion' => 'sometimes|required|string',
            'precio' => 'sometimes|required|numeric|min:0',
            'dias_validez' => 'sometimes|required|integer|min:1',
            'es_vip' => 'sometimes|required|boolean',
        ]);

        $plan->update($validated);

        return response()->json($plan);
    }

    public function destroy(PlanMotorista $plan)
    {
        $plan->delete();

        return response()->json(null, 204);
    }
}
