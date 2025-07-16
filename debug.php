<?php
echo "<h2>🔍 Debug - Informations du serveur</h2>";
echo "<p><strong>URL demandée :</strong> " . $_SERVER['REQUEST_URI'] . "</p>";
echo "<p><strong>Fichier PHP exécuté :</strong> " . __FILE__ . "</p>";
echo "<p><strong>Document Root :</strong> " . $_SERVER['DOCUMENT_ROOT'] . "</p>";
echo "<p><strong>Script Name :</strong> " . $_SERVER['SCRIPT_NAME'] . "</p>";
echo "<p><strong>PHP Self :</strong> " . $_SERVER['PHP_SELF'] . "</p>";
echo "<p><strong>Méthode HTTP :</strong> " . $_SERVER['REQUEST_METHOD'] . "</p>";
echo "<p><strong>Port :</strong> " . $_SERVER['SERVER_PORT'] . "</p>";

echo "<h3>📁 Fichiers présents dans le répertoire :</h3>";
$files = scandir('.');
foreach ($files as $file) {
    if (strpos($file, 'index') !== false || strpos($file, 'admin') !== false) {
        echo "<p>📄 $file</p>";
    }
}

echo "<h3>🔗 Test des redirections :</h3>";
echo "<p><a href='login.html'>Test login.html</a></p>";
echo "<p><a href='admin_protected.php'>Test admin_protected.php</a></p>";
echo "<p><a href='index.php'>Test index.php</a></p>";
echo "<p><a href='index.html'>Test index.html</a></p>";
?>