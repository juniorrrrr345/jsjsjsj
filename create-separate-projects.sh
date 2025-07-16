#!/bin/bash

# Script pour créer les deux projets séparés (Boutique + Admin)
# Usage: ./create-separate-projects.sh

echo "🚀 Création des projets séparés AVEC AMOUR"
echo "=========================================="

# Créer le dossier parent
mkdir -p avec-amour-projects
cd avec-amour-projects

# Créer le projet Boutique
echo "📦 Création du projet Boutique..."
mkdir avec-amour-boutique
cd avec-amour-boutique

# Créer la structure de la boutique
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AVEC AMOUR - Boutique</title>
    <link href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1 class="gradient-text">AVEC AMOUR</h1>
        <nav>
            <a href="/">Accueil</a>
            <a href="/products">Produits</a>
            <a href="/cart">Panier</a>
        </nav>
    </header>

    <main>
        <section class="hero">
            <h2>Bienvenue dans notre boutique</h2>
            <p>Découvrez nos produits de qualité</p>
        </section>

        <section class="products" id="products">
            <!-- Produits chargés dynamiquement -->
        </section>
    </main>

    <footer>
        <p>&copy; 2024 AVEC AMOUR</p>
    </footer>

    <script src="admin-api-shared.js"></script>
    <script src="boutique.js"></script>
</body>
</html>
EOF

# Créer le CSS de la boutique
cat > style.css << 'EOF'
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: white;
}

header {
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem 2rem;
    backdrop-filter: blur(10px);
}

.gradient-text {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
    background-size: 400% 400%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradient 3s ease infinite;
    font-size: 2rem;
    font-weight: bold;
}

@keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

nav {
    margin-top: 1rem;
}

nav a {
    color: white;
    text-decoration: none;
    margin-right: 2rem;
    padding: 0.5rem 1rem;
    border-radius: 25px;
    transition: all 0.3s ease;
}

nav a:hover {
    background: rgba(255, 255, 255, 0.2);
}

.hero {
    text-align: center;
    padding: 4rem 2rem;
}

.hero h2 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.products {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.product-card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 1.5rem;
    backdrop-filter: blur(10px);
    transition: transform 0.3s ease;
}

.product-card:hover {
    transform: translateY(-5px);
}

.product-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 1rem;
}

.product-card h3 {
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
}

.price {
    font-size: 1.5rem;
    font-weight: bold;
    color: #4ecdc4;
    margin-bottom: 0.5rem;
}

.weight {
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 1rem;
}

button {
    background: linear-gradient(45deg, #28a745, #20c997);
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

footer {
    text-align: center;
    padding: 2rem;
    background: rgba(0, 0, 0, 0.2);
    margin-top: 4rem;
}
EOF

# Créer le JavaScript de la boutique
cat > boutique.js << 'EOF'
// Logique de la boutique
class Boutique {
    constructor() {
        this.api = window.sharedAPI;
        this.cart = JSON.parse(localStorage.getItem('avec_amour_cart') || '[]');
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.setupEventListeners();
        this.updateCartCount();
    }

    async loadProducts() {
        try {
            const response = await fetchSharedAPI('./admin-api-shared.js?page=1&limit=50');
            const data = await response.json();
            this.renderProducts(data.products);
        } catch (error) {
            console.error('Erreur chargement produits:', error);
        }
    }

    renderProducts(products) {
        const container = document.getElementById('products');
        if (products.length === 0) {
            container.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Aucun produit disponible</p>';
            return;
        }
        
        container.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.media}" alt="${product.product_name}" onerror="this.src='./hModuTC.jpeg'">
                <h3>${product.product_name}</h3>
                <p class="price">${product.price}€</p>
                <p class="weight">${product.weight}g</p>
                <button onclick="boutique.addToCart(${product.id})">
                    <i class="ri-shopping-cart-line"></i>
                    Ajouter au panier
                </button>
            </div>
        `).join('');
    }

    addToCart(productId) {
        const existingItem = this.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ id: productId, quantity: 1 });
        }
        
        localStorage.setItem('avec_amour_cart', JSON.stringify(this.cart));
        this.updateCartCount();
        this.showNotification('Produit ajouté au panier !');
    }

    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        // Mettre à jour l'affichage du panier si nécessaire
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    setupEventListeners() {
        // Événements de la boutique
    }
}

// Initialiser la boutique
const boutique = new Boutique();
EOF

# Copier l'API partagée
cp ../../admin-api-shared.js .

# Créer la configuration Netlify pour la boutique
cat > netlify.toml << 'EOF'
[build]
  publish = "."
  command = "echo 'Boutique build completed'"

[[redirects]]
  from = "/products"
  to = "/products.html"
  status = 200

[[redirects]]
  from = "/cart"
  to = "/cart.html"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF

# Créer le README pour la boutique
cat > README.md << 'EOF'
# AVEC AMOUR - Boutique

## 🛍️ Boutique en ligne

Site de vente en ligne pour AVEC AMOUR.

## 🚀 Déploiement

1. Poussez ce code sur GitHub
2. Connectez-vous à Netlify
3. Créez un nouveau site depuis Git
4. Sélectionnez ce repository
5. Déployez

## 🔗 URL

- **Boutique** : `https://votre-boutique.netlify.app`

## 📦 Fonctionnalités

- ✅ Affichage des produits
- ✅ Panier d'achat
- ✅ Interface responsive
- ✅ Synchronisation avec le panel admin

## 🔄 Synchronisation

Les données sont synchronisées avec le panel admin via l'API partagée.
EOF

# Initialiser Git pour la boutique
git init
git add .
git commit -m "Initial commit - Boutique AVEC AMOUR"

cd ..

# Créer le projet Admin
echo "🔧 Création du projet Admin..."
mkdir avec-amour-admin
cd avec-amour-admin

# Copier les fichiers du panel admin
cp ../../index.html .
cp ../../admin.html .
cp ../../admin.js .
cp ../../admin.css .
cp ../../admin-api-shared.js .

# Créer la configuration Netlify pour l'admin
cat > netlify.toml << 'EOF'
[build]
  publish = "."
  command = "echo 'Admin build completed'"

[[redirects]]
  from = "/admin"
  to = "/admin.html"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF

# Créer le README pour l'admin
cat > README.md << 'EOF'
# AVEC AMOUR - Panel Administrateur

## 🔧 Panel d'administration

Interface d'administration pour gérer les produits de la boutique AVEC AMOUR.

## 🚀 Déploiement

1. Poussez ce code sur GitHub
2. Connectez-vous à Netlify
3. Créez un nouveau site depuis Git
4. Sélectionnez ce repository
5. Déployez

## 🔗 URL

- **Panel Admin** : `https://votre-admin.netlify.app`

## 🔐 Identifiants

- **Username** : `admin`
- **Password** : `admin123`

## 📊 Fonctionnalités

- ✅ Gestion des produits (CRUD)
- ✅ Statistiques
- ✅ Interface sécurisée
- ✅ Synchronisation avec la boutique

## 🔄 Synchronisation

Les données sont synchronisées avec la boutique via l'API partagée.
EOF

# Initialiser Git pour l'admin
git init
git add .
git commit -m "Initial commit - Panel Admin AVEC AMOUR"

cd ..

echo "✅ Projets créés avec succès !"
echo ""
echo "📁 Structure créée :"
echo "avec-amour-projects/"
echo "├── avec-amour-boutique/  (Boutique)"
echo "└── avec-amour-admin/     (Panel Admin)"
echo ""
echo "🚀 Prochaines étapes :"
echo "1. Poussez chaque projet sur GitHub"
echo "2. Déployez sur Netlify"
echo "3. Configurez les domaines personnalisés"
echo ""
echo "📖 Consultez DEPLOIEMENT_SEPARE.md pour les instructions détaillées"