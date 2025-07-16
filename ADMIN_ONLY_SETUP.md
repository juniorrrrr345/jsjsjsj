# 🔒 Configuration Admin-Only

## 🎯 Objectif

Masquer complètement la boutique et n'afficher que la page de connexion admin et l'accès au panel d'administration.

## 📁 Structure de Sécurité

### ✅ Fichiers Principaux
- **`login.html`** - Page de connexion admin (point d'entrée principal)
- **`admin_login.php`** - Script de connexion
- **`admin_protected.php`** - Panel admin protégé par session
- **`logout.php`** - Script de déconnexion

### ✅ Redirections Configurées

#### Netlify (`netlify.toml`)
```toml
[[redirects]]
  from = "/"
  to = "/login.html"
  status = 301

# Masquer la boutique
[[redirects]]
  from = "/index.html"
  to = "/login.html"
  status = 301

[[redirects]]
  from = "/index.php"
  to = "/login.html"
  status = 301

[[redirects]]
  from = "/products.html"
  to = "/login.html"
  status = 301

[[redirects]]
  from = "/productcard.html"
  to = "/login.html"
  status = 301
```

#### Serveur Apache (`.htaccess`)
```apache
# Masquer la boutique - rediriger vers login admin
RewriteRule ^index\.html$ /login.html [R=301,L]
RewriteRule ^index\.php$ /login.html [R=301,L]
RewriteRule ^products\.html$ /login.html [R=301,L]
RewriteRule ^productcard\.html$ /login.html [R=301,L]

# Permettre l'accès aux fichiers admin uniquement
RewriteCond %{REQUEST_URI} !^/admin_protected\.php
RewriteCond %{REQUEST_URI} !^/login\.html
RewriteCond %{REQUEST_URI} !^/admin_login\.php
RewriteCond %{REQUEST_URI} !^/logout\.php
RewriteCond %{REQUEST_URI} !^/products_api\.php
RewriteCond %{REQUEST_URI} !^/categories_api\.php
RewriteCond %{REQUEST_URI} !^/admin\.css
RewriteCond %{REQUEST_URI} !^/admin\.js
RewriteCond %{REQUEST_URI} !^/uploads/
RewriteCond %{REQUEST_URI} !^/functions/
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /login.html [R=301,L]
```

## 🔐 Flux d'Authentification

### 1. Accès Initial
```
https://votre-site.netlify.app/
↓ (redirection automatique)
https://votre-site.netlify.app/login.html
```

### 2. Connexion Admin
```
login.html → admin_login.php → admin_protected.php
```

### 3. Panel Protégé
- **Vérification de session** : Seuls les admins connectés peuvent accéder
- **Affichage automatique** : Le panel s'affiche directement après connexion
- **Déconnexion sécurisée** : `logout.php` détruit la session

## 🚀 URLs d'Accès

### ✅ URLs Publiques (Accessibles)
- **Page de connexion** : `/login.html`
- **APIs** : `/products_api.php`, `/categories_api.php`
- **Ressources** : `/admin.css`, `/admin.js`, `/uploads/`

### ❌ URLs Masquées (Redirigées vers login)
- **Boutique** : `/index.html`, `/index.php`
- **Produits** : `/products.html`, `/productcard.html`
- **Tout autre fichier** : Redirigé vers `/login.html`

## 🔧 Fonctionnalités

### ✅ Sécurité
- **Session PHP** : Vérification de connexion
- **Redirections** : Masquage complet de la boutique
- **Protection** : Accès uniquement aux admins connectés

### ✅ Panel Admin
- **Gestion produits** : Ajout, modification, suppression
- **Gestion catégories** : Création et suppression
- **Réseaux sociaux** : Configuration complète
- **Statistiques** : Vue d'ensemble en temps réel

### ✅ Mobile Optimisé
- **Interface responsive** : Compatible tous appareils
- **Touch-friendly** : Boutons optimisés pour mobile
- **Performance** : Chargement rapide

## 📱 Test sur Mobile

### URLs de Test
- **Connexion** : `https://votre-site.netlify.app/login.html`
- **Panel Admin** : `https://votre-site.netlify.app/admin_protected.php` (après connexion)

### Identifiants
- **Username** : `admin`
- **Password** : `admin123`

## 🎯 Résultat

✅ **Boutique masquée** : Plus accessible au public  
✅ **Admin sécurisé** : Accès uniquement après connexion  
✅ **Mobile optimisé** : Interface responsive  
✅ **Netlify ready** : Configuration complète  

## 🔍 Vérification

1. **Accédez à** `https://votre-site.netlify.app/`
2. **Vérifiez** que vous êtes redirigé vers la page de connexion
3. **Connectez-vous** avec `admin` / `admin123`
4. **Accédez** au panel admin protégé
5. **Testez** toutes les fonctionnalités

La boutique est maintenant complètement masquée et seul l'admin est accessible ! 🔒