<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Broadcast Driver
    |--------------------------------------------------------------------------
    |
    | This option controls the default broadcast driver that will be used by
    | the framework. You may set this to any of the drivers supported by
    | Laravel and an extension for that driver will be loaded during
    | application startup.
    |
    | Supported drivers: "pusher", "redis", "log", "null"
    |
    */

    'default' => env('BROADCAST_CONNECTION', 'null'),

    /*
    |--------------------------------------------------------------------------
    | Broadcast Connections
    |--------------------------------------------------------------------------
    |
    | Here you may define all of the broadcast connections that will be used
    | to broadcast events to other applications or services.
    |
    */

    'connections' => [

        'pusher' => [
            'driver' => 'pusher',
            'key' => env('PUSHER_APP_KEY'),
            'secret' => env('PUSHER_APP_SECRET'),
            'app_id' => env('PUSHER_APP_ID'),
            'options' => [
                'cluster' => env('PUSHER_APP_CLUSTER'), // Soketi doesn't use cluster, but keep for compatibility
                'host' => env('PUSHER_APP_HOST') ?: '127.0.0.1',
                'port' => env('PUSHER_APP_PORT', 6001),
                'scheme' => env('PUSHER_APP_SCHEME', 'http'),
                'encrypted' => true, // Set to true if using https for Soketi
                'useTLS' => env('PUSHER_APP_SCHEME', 'http') === 'https',
            ],
            'client_options' => [
                // Guzzle client options: https://docs.guzzlephp.org/en/stable/request-options.html
            ],
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => 'default',
        ],

        'log' => [
            'driver' => 'log',
        ],

        'null' => [
            'driver' => 'null',
        ],

    ],

];
