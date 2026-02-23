<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Hash Driver
    |--------------------------------------------------------------------------
    |
    | This option controls the default hash driver that will be used to hash
    | passwords for your application. By default, the argon2id driver is
    | used; however, you remain free to modify this option if you wish.
    |
    | Supported: "bcrypt", "argon2i", "argon2id"
    |
    */

    'driver' => env('HASH_DRIVER', 'argon2id'),

    /*
    |--------------------------------------------------------------------------
    | Argon Options
    |--------------------------------------------------------------------------
    |
    | Here you may specify the configuration options that should be used when
    | passwords are hashed using the Argon2i and Argon2id algorithms. These
    | will influence the amount of time it takes to hash a password.
    |
    */

    'argon' => [
        'memory' => 65536, // 64 MB
        'threads' => 1,
        'time' => 4,
    ],

    /*
    |--------------------------------------------------------------------------
    | Bcrypt Options
    |--------------------------------------------------------------------------
    |
    | Here you may specify the configuration options that should be used when
    | passwords are hashed using the Bcrypt algorithm. This will influence
    | the amount of time it takes to hash a password.
    |
    */

    'bcrypt' => [
        'rounds' => env('BCRYPT_ROUNDS', 12),
        'verify' => true,
    ],

];
