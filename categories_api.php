<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

$host = 'localhost';
$user = 'root'; // Change if needed
$pass = '';
$db = 'ecommerce';
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

function sanitize($str) {
    global $conn;
    return $conn->real_escape_string($str);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Récupérer toutes les catégories
    $sql = "SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != '' ORDER BY category ASC";
    $res = $conn->query($sql);
    $categories = [];
    
    while ($row = $res->fetch_assoc()) {
        $categories[] = $row['category'];
    }
    
    echo json_encode([
        'categories' => $categories,
        'total' => count($categories)
    ]);
    exit();
}

if ($method === 'POST') {
    $category_name = sanitize($_POST['category_name'] ?? '');
    
    if (empty($category_name)) {
        http_response_code(400);
        echo json_encode(['error' => 'Nom de catégorie requis']);
        exit();
    }
    
    // Vérifier si la catégorie existe déjà
    $check_sql = "SELECT COUNT(*) as count FROM products WHERE category = '$category_name'";
    $check_res = $conn->query($check_sql);
    $exists = $check_res->fetch_assoc()['count'] > 0;
    
    if ($exists) {
        http_response_code(400);
        echo json_encode(['error' => 'Cette catégorie existe déjà']);
        exit();
    }
    
    // Créer un produit temporaire pour représenter la catégorie
    $sql = "INSERT INTO products (product_name, category, price, weight, country, description) 
            VALUES ('Catégorie: $category_name', '$category_name', '0', '0', 'Catégorie', 'Catégorie créée automatiquement')";
    
    if ($conn->query($sql)) {
        echo json_encode(['success' => true, 'id' => $conn->insert_id]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => $conn->error]);
    }
    exit();
}

if ($method === 'DELETE') {
    $input = file_get_contents('php://input');
    parse_str($input, $_DELETE);
    $category_name = sanitize($_DELETE['category_name'] ?? '');
    
    if (empty($category_name)) {
        http_response_code(400);
        echo json_encode(['error' => 'Nom de catégorie requis']);
        exit();
    }
    
    // Supprimer tous les produits de cette catégorie
    $sql = "DELETE FROM products WHERE category = '$category_name'";
    
    if ($conn->query($sql)) {
        echo json_encode(['success' => true, 'deleted_count' => $conn->affected_rows]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => $conn->error]);
    }
    exit();
}

// OPTIONS preflight
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

http_response_code(405);
echo json_encode(['error' => 'Method Not Allowed']);
exit();