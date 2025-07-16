<?php
// Configuration pour serveur local
// Ce fichier peut être utilisé pour tester les redirections

// Vérifier si on accède à la racine
if ($_SERVER['REQUEST_URI'] === '/' || $_SERVER['REQUEST_URI'] === '/index.php') {
    header('Location: login.html');
    exit();
}

// Si on accède à des pages de boutique, rediriger vers login
$shop_pages = ['products.html', 'productcard.html', 'contact.html'];
$current_page = basename($_SERVER['REQUEST_URI']);

if (in_array($current_page, $shop_pages)) {
    header('Location: login.html');
    exit();
}

// Si on est déjà connecté et qu'on accède à login.html, rediriger vers admin
if (isset($_SESSION['admin_username']) && $current_page === 'login.html') {
    header('Location: admin_protected.php');
    exit();
}

echo "Configuration serveur local chargée.";
?>