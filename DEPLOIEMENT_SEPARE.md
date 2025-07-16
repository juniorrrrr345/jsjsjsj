# 🚀 Déploiement Séparé : Boutique + Panel Admin

## 🎯 Objectif

Avoir **deux sites Netlify séparés** :
1. **Boutique** : `https://votre-boutique.netlify.app`
2. **Panel Admin** : `https://votre-admin.netlify.app`

Avec **synchronisation automatique** des données entre les deux.

## 📁 Structure des projets

### Projet 1 : Boutique
```
boutique/
├── index.html          # Page d'accueil de la boutique
├── products.html       # Page des produits
├── product-detail.html # Détail d'un produit
├── cart.html          # Panier
├── checkout.html      # Paiement
├── style.css          # Styles de la boutique
├── boutique.js        # Logique de la boutique
├── admin-api-shared.js # API partagée
├── netlify.toml       # Configuration Netlify
└── _redirects         # Redirections
```

### Projet 2 : Panel Admin
```
admin/
├── index.html          # Page d'accueil (redirection admin)
├── admin.html          # Panel administrateur
├── admin.js           # Logique du panel admin
├── admin.css          # Styles du panel admin
├── admin-api-shared.js # API partagée (même fichier)
├── netlify.toml       # Configuration Netlify
└── _redirects         # Redirections
```

## 🔧 Configuration étape par étape

### Étape 1 : Créer les deux repositories

#### Repository 1 : `avec-amour-boutique`
```bash
mkdir avec-amour-boutique
cd avec-amour-boutique
git init
```

#### Repository 2 : `avec-amour-admin`
```bash
mkdir avec-amour-admin
cd avec-amour-admin
git init
```

### Étape 2 : Configurer la Boutique

#### `boutique/index.html`
```html
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
```

#### `boutique/boutique.js`
```javascript
// Logique de la boutique
class Boutique {
    constructor() {
        this.api = window.sharedAPI;
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.setupEventListeners();
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
        container.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.media}" alt="${product.product_name}">
                <h3>${product.product_name}</h3>
                <p class="price">${product.price}€</p>
                <p class="weight">${product.weight}g</p>
                <button onclick="boutique.addToCart(${product.id})">
                    Ajouter au panier
                </button>
            </div>
        `).join('');
    }

    addToCart(productId) {
        // Logique d'ajout au panier
        console.log('Ajout au panier:', productId);
    }

    setupEventListeners() {
        // Événements de la boutique
    }
}

// Initialiser la boutique
const boutique = new Boutique();
```

### Étape 3 : Configurer le Panel Admin

#### `admin/index.html` (déjà créé)
- Redirection vers le panel admin
- Interface d'authentification

#### `admin/admin.js` (modifié)
```javascript
// Configuration
const API_BASE_URL = './admin-api-shared.js'; // Utilise l'API partagée
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// ... reste du code inchangé ...
```

### Étape 4 : Configuration Netlify

#### `boutique/netlify.toml`
```toml
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
```

#### `admin/netlify.toml`
```toml
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
```

## 🔄 Synchronisation des données

### Méthode 1 : localStorage partagé (Recommandée)

Les deux sites utilisent le même fichier `admin-api-shared.js` qui :
- Stocke les données dans localStorage
- Utilise les mêmes clés de stockage
- Synchronise automatiquement

### Méthode 2 : Export/Import manuel

#### Dans le Panel Admin
```javascript
// Exporter les données
function exportData() {
    const data = sharedAPI.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'avec-amour-data.json';
    a.click();
}

// Importer les données
function importData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = JSON.parse(e.target.result);
        sharedAPI.importData(data);
        alert('Données importées avec succès !');
    };
    reader.readAsText(file);
}
```

## 🚀 Déploiement

### Déploiement de la Boutique
1. Poussez le code sur `avec-amour-boutique`
2. Connectez-vous à Netlify
3. Créez un nouveau site depuis Git
4. Sélectionnez le repository `avec-amour-boutique`
5. Déployez

### Déploiement du Panel Admin
1. Poussez le code sur `avec-amour-admin`
2. Connectez-vous à Netlify
3. Créez un nouveau site depuis Git
4. Sélectionnez le repository `avec-amour-admin`
5. Déployez

## 🔗 URLs finales

- **Boutique** : `https://votre-boutique.netlify.app`
- **Panel Admin** : `https://votre-admin.netlify.app`

## 🔒 Sécurité

### Panel Admin
- Authentification : `admin` / `admin123`
- Accès protégé
- Gestion complète des produits

### Boutique
- Affichage public des produits
- Panier côté client
- Pas d'accès aux données sensibles

## 📊 Avantages de cette approche

✅ **Séparation claire** : Boutique et admin séparés  
✅ **Sécurité** : Admin protégé, boutique publique  
✅ **Synchronisation** : Données partagées via localStorage  
✅ **Maintenance** : Chaque site indépendant  
✅ **Performance** : Chaque site optimisé pour son usage  
✅ **Scalabilité** : Facile d'ajouter des fonctionnalités  

## 🔧 Maintenance

### Mise à jour des données
1. Connectez-vous au panel admin
2. Modifiez les produits
3. Les changements sont automatiquement synchronisés

### Sauvegarde
```javascript
// Dans le panel admin
const backup = sharedAPI.exportData();
// Sauvegardez le fichier JSON
```

### Restauration
```javascript
// Dans le panel admin
sharedAPI.importData(backupData);
```

## 🆘 Support

Pour toute question :
- Vérifiez les logs de déploiement dans Netlify
- Testez la synchronisation entre les deux sites
- Consultez la console du navigateur pour les erreurs