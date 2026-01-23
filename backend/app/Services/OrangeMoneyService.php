<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class OrangeMoneyService
{
    private $baseUrl;
    private $merchantKey;

    public function __construct()
    {
        // En producción, esto vendría de config/services.php
        $this->baseUrl = 'https://api.orange.com/orange-money-webpay/dev/v1';
        $this->merchantKey = env('OM_MERCHANT_KEY', 'test_merchant_key');
    }

    /**
     * Simula la inicialización de un pago web con Orange Money.
     */
    public function webPayment($amount, $orderId, $returnUrl, $cancelUrl)
    {
        // Simulación: En un entorno real haríamos un POST a la API de OM
        // $response = Http::withHeaders([...])->post(...);

        // Generamos un token de pago simulado
        $payToken = 'MP-' . Str::random(20);
        
        return [
            'status' => 'SUCCESS',
            'message' => 'Payment initiated',
            'pay_token' => $payToken,
            'payment_url' => "https://webpayment.orange-money.com/pay/v1/{$payToken}?return_url={$returnUrl}&cancel_url={$cancelUrl}",
            'notif_token' => Str::random(32)
        ];
    }

    /**
     * Simula la validación de estado de una transacción.
     */
    public function checkTransactionStatus($orderId)
    {
        // Simulación: Siempre devuelve SUCCESS para propósitos de demo
        return [
            'status' => 'SUCCESS',
            'transaction_status' => 'INITIATED', // pending, success, failed
            'amount' => 500,
            'currency' => 'XOF'
        ];
    }
}
