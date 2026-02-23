<?php
// [ES] Motor de Internacionalización simple para PHP
// [FR] Moteur d'Internationalisation simple pour PHP

function __($key) {
    static $translations = null;
    static $currentLang = null;

    // [ES] Determinar el idioma (por defecto español)
    // [FR] Déterminer la langue (espagnol par défaut)
    $lang = $_GET['lang'] ?? $_SESSION['lang'] ?? 'es';
    
    // [ES] Solo cargar el archivo si el idioma ha cambiado o no ha sido cargado
    // [FR] Ne charger le fichier que si la langue a changé ou n'a pas été chargée
    if ($translations === null || $currentLang !== $lang) {
        $filePath = __DIR__ . "/lang/{$lang}.json";
        
        if (file_exists($filePath)) {
            $jsonContent = file_get_contents($filePath);
            $translations = json_decode($jsonContent, true);
            $currentLang = $lang;
        } else {
            // [ES] Fallback a español si el archivo de idioma no existe
            $translations = json_decode(file_get_contents(__DIR__ . "/lang/es.json"), true);
            $currentLang = 'es';
        }
    }

    // [ES] Retornar traducción o la clave original como fallback seguro
    // [FR] Retourner la traduction ou la clé originale comme repli sécurisé
    return $translations[$key] ?? $key;
}
?>
