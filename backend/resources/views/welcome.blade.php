<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
        <meta name="theme-color" content="#2563eb">

        <title>{{ config('app.name', 'MotoTX') }} - Transporte Seguro en Bamako</title>
        <meta name="description" content="MotoTX: La plataforma líder de moto-taxis en Bamako. Viajes seguros, rápidos y económicos a tu alcance.">
        <meta name="keywords" content="Moto taxi, Bamako, transporte, Mali, seguridad, viajes baratos">
        
        <!-- OpenGraph para redes sociales -->
        <meta property="og:title" content="MotoTX - Transporte Seguro en Bamako">
        <meta property="og:description" content="Solicita tu moto-taxi de forma segura en Bamako con MotoTX.">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://mtxnov-production.up.railway.app">
        <meta property="og:image" content="/logo_clean.png">

        <!-- Marcado Estructurado JSON-LD (Cr 1.e.3) -->
        <script type="application/ld+json">
        {
          "@@context": "https://schema.org",
          "@@type": "Service",
          "name": "MotoTX",
          "description": "Servicio de transporte de moto-taxi en Bamako, Mali.",
          "provider": {
            "@@type": "LocalBusiness",
            "name": "MotoTX Bamako",
            "address": {
              "@@type": "PostalAddress",
              "addressLocality": "Bamako",
              "addressCountry": "ML"
            }
          },
          "areaServed": "Bamako",
          "hasOfferCatalog": {
            "@@type": "OfferCatalog",
            "name": "Planes de Transporte",
            "itemListElement": [
              {
                "@@type": "Offer",
                "itemOffered": {
                  "@@type": "Service",
                  "name": "Viajes Individuales"
                }
              }
            ]
          }
        }
        </script>

        {{-- Leaflet CSS for map component --}}
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
         integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
         crossorigin=""/>

        <link rel="manifest" href="/manifest.webmanifest">
        
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app_entry.jsx'])
    </head>
    <body style="margin: 0; padding: 0;">
        <div id="root"></div>
    </body>
</html>