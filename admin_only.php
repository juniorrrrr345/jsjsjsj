<?php
// Vérifier si l'utilisateur est connecté en tant qu'admin
session_start();

// Si l'utilisateur n'est pas connecté, rediriger vers la page de login
if (!isset($_SESSION['admin_id']) || !isset($_SESSION['admin_username'])) {
    header('Location: login.html');
    exit();
}

// Si l'utilisateur est connecté, permettre l'accès au panel admin
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accès Admin - Vérifié</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            backdrop-filter: blur(10px);
        }
        .success {
            color: #4CAF50;
            font-size: 2rem;
            margin-bottom: 1rem;
        }
        .btn {
            background: linear-gradient(135deg, #009CFF 0%, #4DC7A0 100%);
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 10px;
            text-decoration: none;
            display: inline-block;
            margin: 0.5rem;
            transition: all 0.3s ease;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="success">✅ Accès Admin Vérifié</div>
        <h2>Bienvenue, <?php echo htmlspecialchars($_SESSION['admin_username']); ?> !</h2>
        <p>Vous avez accès au panel d'administration.</p>
        
        <div style="margin-top: 2rem;">
            <a href="admin.html" class="btn">🚀 Accéder au Panel Admin</a>
            <a href="mobile_test.html" class="btn">📱 Test Mobile</a>
            <a href="test_simple.html" class="btn">🧪 Tests API</a>
        </div>
        
        <div style="margin-top: 2rem;">
            <a href="logout.php" class="btn" style="background: #dc3545;">🔓 Déconnexion</a>
        </div>
    </div>
</body>
</html>