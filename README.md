# AVEC AMOUR - Panel Administrateur

## 🎯 Description

Ce repository contient uniquement le **Panel Administrateur** pour AVEC AMOUR. Le site a été simplifié pour ne présenter que l'interface d'administration.

## 🚀 Déploiement sur Netlify

### Accès direct
- **URL principale** : `https://votre-site.netlify.app`
- **Panel Admin** : `https://votre-site.netlify.app/admin`
- **Test API** : `https://votre-site.netlify.app/test-api.html`

### Identifiants de connexion
- **Username** : `admin`
- **Password** : `admin123`

## 📁 Structure du projet

```
├── index.html          # Page d'accueil (redirection vers admin)
├── admin.html          # Panel administrateur principal
├── admin.js           # Logique du panel admin
├── admin-api.js       # API JavaScript statique
├── admin.css          # Styles du panel admin
├── test-admin.html    # Page de test de l'API
├── netlify.toml       # Configuration Netlify
├── _redirects         # Redirections Netlify
└── package.json       # Configuration du projet
```

## 🔧 Fonctionnalités

### ✅ Panel Administrateur
- **Authentification sécurisée**
- **Gestion des produits** (CRUD complet)
- **Recherche de produits**
- **Statistiques en temps réel**
- **Interface moderne et responsive**

### 🗂️ Stockage des données
- **localStorage** : Données persistantes dans le navigateur
- **Données initiales** : Produits pré-chargés
- **Synchronisation** : Données sauvegardées automatiquement

## 🎨 Interface

### Page d'accueil
- Design moderne avec gradient animé
- Redirection automatique vers le panel admin
- Présentation des fonctionnalités

### Panel Admin
- Interface intuitive et moderne
- Navigation par onglets
- Formulaires optimisés
- Notifications en temps réel

## 🚀 Déploiement

### Méthode 1 : Drag & Drop (Recommandé)
1. Allez sur [app.netlify.com](https://app.netlify.com)
2. Glissez-déposez le dossier du projet
3. Le site sera automatiquement déployé

### Méthode 2 : Via Git
```bash
# Cloner le repository
git clone [URL_DU_REPO]

# Déployer sur Netlify
# Via l'interface web ou CLI
```

## 🔒 Sécurité

- **Authentification** : Accès protégé par identifiants
- **Données locales** : Aucune base de données externe
- **HTTPS** : Sécurisé par défaut sur Netlify

## 📱 Compatibilité

- ✅ **Desktop** : Chrome, Firefox, Safari, Edge
- ✅ **Mobile** : Responsive design
- ✅ **Tablet** : Interface adaptée

## 🛠️ Technologies utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Styles modernes avec gradients et animations
- **JavaScript ES6+** : Logique côté client
- **localStorage** : Stockage des données
- **Remix Icons** : Icônes modernes

## 📊 Fonctionnalités détaillées

### Gestion des produits
- ✅ Ajouter un nouveau produit
- ✅ Modifier un produit existant
- ✅ Supprimer un produit
- ✅ Rechercher des produits
- ✅ Upload d'images (simulé)

### Statistiques
- 📈 Nombre total de produits
- 📊 Nombre de catégories
- 💰 Revenus (simulés)
- 📦 Commandes (à implémenter)

## 🔄 Mise à jour

Pour mettre à jour le site :
1. Modifiez les fichiers localement
2. Poussez les changements sur Git
3. Netlify déploiera automatiquement

## 📞 Support

Pour toute question ou problème :
- Consultez les logs de déploiement dans Netlify
- Vérifiez la console du navigateur pour les erreurs
- Testez l'API via `test-admin.html`

---

**AVEC AMOUR** - Panel Administrateur v1.0