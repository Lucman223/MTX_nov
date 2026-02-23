<?php
require_once 'i18n.php';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- [ES] Metadatos dinámicos con i18n -->
    <title><?php echo $page_title ?? __('default_title'); ?></title>
    <meta name="description" content="<?php echo $page_meta_desc ?? __('default_desc'); ?>">
    
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 40px auto; padding: 20px; }
        header { border-bottom: 2px solid #2563eb; margin-bottom: 20px; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
        nav a { margin-right: 15px; color: #2563eb; text-decoration: none; font-weight: bold; }
        .meta-info { background: #f3f4f6; padding: 10px; border-radius: 5px; font-size: 0.9em; color: #666; margin-top: 20px; }
        .lang-switch { font-size: 0.8em; }
    </style>
</head>
<body>
    <header>
        <h1><?php echo __('app_name'); ?></h1>
        <nav>
            <a href="index.php?lang=<?php echo $_GET['lang'] ?? 'es'; ?>"><?php echo __('nav_home'); ?></a>
            <a href="dashboard.php?lang=<?php echo $_GET['lang'] ?? 'es'; ?>"><?php echo __('nav_dashboard'); ?></a>
        </nav>
        <div class="lang-switch">
            <a href="?lang=es">ES</a> | <a href="?lang=fr">FR</a>
        </div>
    </header>
