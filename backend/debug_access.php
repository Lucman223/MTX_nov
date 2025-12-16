<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::where('rol', 'motorista')->first();
if (!$user) {
    echo "No motorista found.\n";
    exit;
}

$perfil = App\Models\MotoristaPerfil::where('usuario_id', $user->id)->first();
if (!$perfil) {
    echo "No profile found for user {$user->id}.\n";
    exit;
}

echo "Motorista ID: {$user->id}\n";
echo "Perfil Found. Viajes Prueba: {$perfil->viajes_prueba_restantes}\n";

$query = $perfil->activeSubscription();
echo "SQL: " . $query->toSql() . "\n";
echo "Bindings: " . json_encode($query->getBindings()) . "\n";

$sub = $query->first();

if ($sub) {
    echo "Active Subscription Found: ID {$sub->id}, Ends: {$sub->fecha_fin}\n";
} else {
    echo "No Active Subscription found.\n";
    
    // Debug why
    $allSubs = App\Models\SuscripcionMotorista::where('motorista_id', $user->id)->get();
    echo "Total Subs in DB: " . $allSubs->count() . "\n";
    foreach ($allSubs as $s) {
        echo " - Sub {$s->id}: State={$s->estado}, Ends={$s->fecha_fin}, IsFuture? " . ($s->fecha_fin > now() ? 'YES' : 'NO') . "\n";
        echo "   (Now is " . now() . ")\n";
    }
}

echo "Has Access? " . ($perfil->hasAccess() ? 'YES' : 'NO') . "\n";
