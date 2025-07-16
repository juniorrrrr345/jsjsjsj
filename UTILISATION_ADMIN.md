# 🚀 Guide d'Utilisation du Panel Administrateur

## 📋 Accès au Panel

### Option 1 : Accès Direct (Recommandé)
- **URL** : `http://localhost:8080/admin.html`
- **Identifiants** : 
  - Username : `admin`
  - Password : `admin123`

### Option 2 : Via la Page de Test
- **URL** : `http://localhost:8080/test_simple.html`
- Cliquez sur "Panel Admin Principal"

### Option 3 : Via Login PHP
- **URL** : `http://localhost:8080/login.html`
- Utilisez les identifiants de votre base de données

## 🔧 Fonctionnalités Disponibles

### ✅ Produits
- **Ajouter un produit** : Cliquez sur "Ajouter un produit"
- **Modifier un produit** : Cliquez sur "Modifier" sur une carte produit
- **Supprimer un produit** : Cliquez sur "Supprimer" sur une carte produit
- **Rechercher** : Utilisez la barre de recherche

### ✅ Catégories
- **Ajouter une catégorie** : Cliquez sur "Ajouter une catégorie"
- **Supprimer une catégorie** : Cliquez sur "Supprimer" sur une carte catégorie

### ✅ Réseaux Sociaux
- **Configurer** : Allez dans l'onglet "Réseaux Sociaux"
- **Sauvegarder** : Cliquez sur "Sauvegarder"
- **Réseaux supportés** : Facebook, Instagram, Twitter/X, LinkedIn, YouTube, WhatsApp

### ✅ Statistiques
- **Voir les stats** : Allez dans l'onglet "Statistiques"
- **Mise à jour automatique** : Les stats se mettent à jour automatiquement

## 🧪 Tests

### Test des APIs
- **URL** : `http://localhost:8080/test_admin.html`
- Testez l'ajout/suppression de produits et catégories

### Test Simple
- **URL** : `http://localhost:8080/test_simple.html`
- Vérification automatique des APIs

## 🔍 Dépannage

### Problème de connexion
1. Vérifiez que le serveur PHP est démarré
2. Vérifiez que la base de données est accessible
3. Vérifiez les paramètres de connexion dans les fichiers API

### Problème d'affichage
1. Vérifiez que tous les fichiers CSS et JS sont présents
2. Vérifiez la console du navigateur pour les erreurs JavaScript

### Problème d'ajout/suppression
1. Vérifiez les permissions du dossier `uploads/`
2. Vérifiez les logs PHP pour les erreurs
3. Testez les APIs directement avec `test_admin.html`

## 📁 Structure des Fichiers

```
├── admin.html          # Panel admin principal
├── admin.js           # Logique JavaScript
├── admin.css          # Styles CSS
├── products_api.php   # API des produits
├── categories_api.php # API des catégories
├── test_simple.html   # Page de test simple
├── test_admin.html    # Tests des APIs
├── login.html         # Page de connexion PHP
├── admin_login.php    # Script de connexion PHP
└── uploads/          # Dossier des images uploadées
```

## 🎯 Fonctionnalités Corrigées

### ✅ Bugs Corrigés
- **Suppression de produits** : Maintenant fonctionnelle
- **Ajout de produits** : Amélioré et stable
- **Gestion des catégories** : Nouvelle fonctionnalité complète
- **Interface utilisateur** : Moderne et responsive

### ✅ Nouvelles Fonctionnalités
- **Configuration réseaux sociaux** : Interface complète
- **Gestion des catégories** : CRUD complet
- **Notifications** : Système de notifications en temps réel
- **Recherche** : Recherche en temps réel des produits

## 🔐 Sécurité

### Identifiants par défaut
- **Username** : `admin`
- **Password** : `admin123`

### Recommandations
1. Changez les identifiants par défaut
2. Utilisez HTTPS en production
3. Limitez l'accès aux fichiers sensibles
4. Sauvegardez régulièrement la base de données

## 📞 Support

En cas de problème :
1. Vérifiez les logs PHP
2. Testez les APIs avec `test_admin.html`
3. Vérifiez la console du navigateur
4. Consultez le fichier `CORRECTIONS_ADMIN.md` pour plus de détails