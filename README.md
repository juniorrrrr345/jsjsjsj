# AVEC AMOUR - Site Web

Site web pour AVEC AMOUR, spécialisé dans la vente et livraison de produits dans l'Ile de France.

## 🚀 Déploiement sur Vercel

### Prérequis
- Compte Vercel (gratuit sur [vercel.com](https://vercel.com))
- Git installé sur votre machine

### Étapes de déploiement

1. **Installer Vercel CLI** (optionnel)
   ```bash
   npm i -g vercel
   ```

2. **Déployer directement depuis GitHub/GitLab**
   - Poussez votre code sur GitHub ou GitLab
   - Connectez-vous à [vercel.com](https://vercel.com)
   - Cliquez sur "New Project"
   - Importez votre repository
   - Vercel détectera automatiquement la configuration

3. **Déployer depuis la ligne de commande**
   ```bash
   # Dans le dossier de votre projet
   vercel
   ```

4. **Configuration automatique**
   - Le fichier `vercel.json` configure automatiquement :
     - Les fichiers statiques (HTML, CSS, JS, images)
     - Les routes pour chaque page
     - Les en-têtes de sécurité

### Structure du projet

```
├── index.html          # Page d'accueil
├── products.html       # Page des produits
├── contact.html        # Page de contact
├── signin.html         # Page de connexion
├── signup.html         # Page d'inscription
├── style.css           # Styles principaux
├── main.js             # JavaScript principal
├── vercel.json         # Configuration Vercel
└── package.json        # Métadonnées du projet
```

### Fonctionnalités

- ✅ Site statique optimisé
- ✅ Navigation entre les pages
- ✅ Design responsive
- ✅ Intégration Remix Icons
- ✅ Animations CSS
- ✅ Configuration de sécurité

### URLs de déploiement

Après le déploiement, votre site sera accessible sur :
- `https://votre-projet.vercel.app`
- `https://votre-projet.vercel.app/products`
- `https://votre-projet.vercel.app/contact`
- etc.

### Support

Pour toute question concernant le déploiement, consultez la [documentation Vercel](https://vercel.com/docs).

---

**AVEC AMOUR** - Livraisons dans toute l'Ile de France 🚗📦