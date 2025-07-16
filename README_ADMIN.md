# Panel Administrateur - AVEC AMOUR

## 🚀 Fonctionnalités

Le panel administrateur de votre boutique "AVEC AMOUR" offre une interface moderne et intuitive pour gérer vos produits et votre boutique.

### ✨ Fonctionnalités principales

- **🔐 Authentification sécurisée** - Connexion avec nom d'utilisateur et mot de passe
- **📦 Gestion des produits** - Ajouter, modifier, supprimer et rechercher des produits
- **📊 Statistiques** - Vue d'ensemble de votre boutique
- **🎨 Interface moderne** - Design adapté au style de votre boutique
- **📱 Responsive** - Compatible mobile et desktop
- **⚡ Performance** - Interface fluide et réactive

## 🔑 Accès au panel

### Identifiants par défaut
- **Nom d'utilisateur :** `admin`
- **Mot de passe :** `admin123`

⚠️ **Important :** Changez ces identifiants dans le fichier `admin.js` pour sécuriser votre panel.

## 📁 Structure des fichiers

```
├── admin.html          # Interface du panel administrateur
├── admin.css           # Styles du panel
├── admin.js            # Logique JavaScript
├── products_api.php    # API pour la gestion des produits
└── README_ADMIN.md     # Ce fichier
```

## 🛠️ Installation et déploiement

### 1. Prérequis
- Serveur web avec support PHP
- Base de données MySQL/MariaDB
- Accès aux fichiers de votre boutique

### 2. Configuration de la base de données
Assurez-vous que votre base de données contient les tables nécessaires :

```sql
-- Table des produits
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `media` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `category` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `weight` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
);

-- Table des administrateurs
CREATE TABLE `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
);
```

### 3. Configuration de l'API
Modifiez les paramètres de connexion dans `products_api.php` :

```php
$host = 'localhost';
$user = 'votre_utilisateur';
$pass = 'votre_mot_de_passe';
$db = 'votre_base_de_donnees';
```

### 4. Déploiement sur Netlify

1. **Préparer les fichiers :**
   - Assurez-vous que tous les fichiers sont dans le même dossier
   - Vérifiez que les chemins des images sont corrects

2. **Déployer sur Netlify :**
   - Connectez-vous à votre compte Netlify
   - Glissez-déposez le dossier contenant vos fichiers
   - Ou connectez votre repository GitHub

3. **Configuration Netlify :**
   - Allez dans les paramètres de votre site
   - Configurez les variables d'environnement si nécessaire
   - Activez HTTPS

## 🎯 Utilisation du panel

### 1. Connexion
- Accédez à `admin.html` dans votre navigateur
- Entrez vos identifiants
- Cliquez sur "Se connecter"

### 2. Gestion des produits

#### Ajouter un produit
1. Cliquez sur "Ajouter un produit"
2. Remplissez le formulaire :
   - **Nom du produit** : Nom de votre produit
   - **Prix** : Prix en euros
   - **Poids** : Poids en grammes
   - **Catégorie** : Catégorie du produit
   - **Pays d'origine** : Pays d'origine
   - **Description** : Description détaillée
   - **Image** : Image du produit (optionnel)
3. Cliquez sur "Enregistrer"

#### Modifier un produit
1. Cliquez sur "Modifier" sur la carte du produit
2. Modifiez les champs souhaités
3. Cliquez sur "Enregistrer"

#### Supprimer un produit
1. Cliquez sur "Supprimer" sur la carte du produit
2. Confirmez la suppression dans la modal

#### Rechercher des produits
- Utilisez la barre de recherche pour filtrer les produits
- La recherche fonctionne sur le nom, la catégorie et le pays

### 3. Navigation
- **Produits** : Gestion des produits
- **Catégories** : Gestion des catégories (à implémenter)
- **Commandes** : Gestion des commandes (à implémenter)
- **Statistiques** : Vue d'ensemble de la boutique

### 4. Statistiques
Le panel affiche automatiquement :
- Nombre total de produits
- Nombre de catégories
- Revenus totaux (calculés à partir des prix)

## 🔧 Personnalisation

### Changer les identifiants
Modifiez les identifiants dans `admin.js` :

```javascript
const ADMIN_CREDENTIALS = {
    username: 'votre_nom_utilisateur',
    password: 'votre_mot_de_passe'
};
```

### Modifier le style
- Éditez `admin.css` pour personnaliser l'apparence
- Les variables CSS permettent de changer facilement les couleurs
- Le design utilise les mêmes couleurs que votre boutique

### Ajouter des fonctionnalités
- Modifiez `admin.js` pour ajouter de nouvelles fonctionnalités
- Étendez l'API PHP pour de nouvelles opérations
- Ajoutez de nouvelles sections dans `admin.html`

## 🛡️ Sécurité

### Recommandations
1. **Changez les identifiants par défaut**
2. **Utilisez HTTPS** pour sécuriser les connexions
3. **Limitez l'accès** au panel administrateur
4. **Sauvegardez régulièrement** votre base de données
5. **Surveillez les logs** pour détecter les tentatives d'intrusion

### Authentification avancée
Pour une sécurité renforcée, vous pouvez :
- Implémenter une authentification par base de données
- Ajouter une authentification à deux facteurs
- Utiliser des tokens JWT
- Limiter les tentatives de connexion

## 🐛 Dépannage

### Problèmes courants

**Le panel ne se charge pas :**
- Vérifiez que tous les fichiers sont présents
- Contrôlez la console du navigateur pour les erreurs
- Assurez-vous que l'API PHP fonctionne

**Erreur de connexion à la base de données :**
- Vérifiez les paramètres de connexion dans `products_api.php`
- Assurez-vous que la base de données est accessible
- Contrôlez les permissions de l'utilisateur MySQL

**Les images ne s'affichent pas :**
- Vérifiez les chemins des images
- Assurez-vous que le dossier `uploads/` existe et est accessible
- Contrôlez les permissions des fichiers

**Problèmes de déploiement sur Netlify :**
- Vérifiez que tous les fichiers sont inclus dans le déploiement
- Assurez-vous que l'API PHP est accessible
- Contrôlez les paramètres de build si nécessaire

## 📞 Support

Pour toute question ou problème :
1. Vérifiez d'abord ce README
2. Consultez la console du navigateur pour les erreurs
3. Vérifiez les logs du serveur
4. Contactez le support technique si nécessaire

---

**AVEC AMOUR** - Panel Administrateur v1.0