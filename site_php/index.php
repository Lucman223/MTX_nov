<?php
// [ES] Declaración de variables SEO usando i18n
require_once 'i18n.php';
$page_title = __('home_title');
$page_meta_desc = __('home_desc');

require_once 'header.php';
?>

<main>
    <h2><?php echo __('home_welcome'); ?></h2>
    <p><?php echo __('home_desc'); ?></p>
    
    <div class="meta-info">
        <strong>SEO Debug:</strong><br>
        Título: <?php echo $page_title; ?><br>
        Descripción: <?php echo $page_meta_desc; ?>
    </div>
</main>

</body>
</html>
