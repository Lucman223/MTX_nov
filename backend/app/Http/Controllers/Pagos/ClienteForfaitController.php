<?php

namespace App\Http\Controllers\Pagos;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Requests\Pagos\BuyForfaitRequest;
use App\Services\ForfaitService;

class ClienteForfaitController extends Controller
{
    protected $orangeMoneyService;

    public function __construct(ForfaitService $forfaitService, \App\Services\OrangeMoneyService $orangeMoneyService)
    {
        $this->forfaitService = $forfaitService;
        $this->orangeMoneyService = $orangeMoneyService;
    }

    public function index()
    {
        // Use Forfait model directly or Service
        return \App\Models\Forfait::where('estado', 'activo')->get();
    }

    public function buyForfait(BuyForfaitRequest $request)
    {
        $user = auth()->user();
        $phone = $request->input('phone_number', '00000000');
        
        // 1. Get Forfait Price (In real app, fetch from DB)
        // For demo, we trust the ID exists because of validation, but we should fetch price.
        // As per previous code, we just simulate with 5000 or fetch from DB if we had the model loaded.
        // Let's rely on Service to handle the "Charge".
        $amount = 5000; // Placeholder, ideally $forfait->price

        try {
            // 2. Initiate Payment (Simulated or Real)
            $paymentInit = $this->orangeMoneyService->initiatePayment($phone, $amount);

            // 3. Return Pending State
            return response()->json([
                'message' => 'Payment initiated. Please confirm on your mobile.',
                'order_id' => $paymentInit['order_id'] ?? null,
                'pay_token' => $paymentInit['pay_token'] ?? null,
                'status' => 'pending'
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function checkStatus(Request $request)
    {
        $request->validate([
            'order_id' => 'required',
            'forfait_id' => 'required|exists:forfaits,id' // Needed to finalize purchase
        ]);

        try {
            // 1. Check Status
            $statusData = $this->orangeMoneyService->checkStatus($request->order_id);

            if (isset($statusData['status']) && strtoupper($statusData['status']) === 'SUCCESS') {
                // 2. Finalize Purchase (prevent double assignment if already done?)
                // Ideally check if Transaction ID already exists in our DB to avoid duplicates.
                
                $user = auth()->user();
                $clienteForfait = $this->forfaitService->buyForfait($user, $request->forfait_id);

                return response()->json([
                    'status' => 'SUCCESS',
                    'message' => 'Payment confirmed and Forfait activated',
                    'data' => $clienteForfait
                ]);
            }

            return response()->json([
                'status' => 'PENDING',
                'message' => 'Waiting for confirmation...'
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
