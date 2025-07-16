// Configuration
const API_BASE_URL = './products_api.php';
const CATEGORIES_API_URL = './categories_api.php';
// Configuration pour Netlify (si nécessaire)
// const API_BASE_URL = '/.netlify/functions/api/products.php';
// const CATEGORIES_API_URL = '/.netlify/functions/api/categories.php';
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// État global de l'application
let currentUser = null;
let products = [];
let categories = [];

// Éléments DOM
const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const productModal = document.getElementById('productModal');
const deleteModal = document.getElementById('deleteModal');
const productForm = document.getElementById('productForm');
const productSearch = document.getElementById('productSearch');
const productsGrid = document.getElementById('productsGrid');

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    // Vérifier si l'utilisateur est déjà connecté
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
        loadProducts();
        updateStats();
    }
}

function setupEventListeners() {
    // Login
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);

    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchSection(btn.dataset.section));
    });

    // Produits
    document.getElementById('addProductBtn').addEventListener('click', () => openProductModal());
    productSearch.addEventListener('input', debounce(handleProductSearch, 300));
    productForm.addEventListener('submit', handleProductSubmit);

    // Réseaux sociaux
    document.getElementById('saveSocialBtn').addEventListener('click', handleSocialSave);

    // Catégories
    document.getElementById('addCategoryBtn').addEventListener('click', openCategoryModal);

    // Modals
    document.getElementById('closeModal').addEventListener('click', closeProductModal);
    document.getElementById('cancelProduct').addEventListener('click', closeProductModal);
    document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);
    document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal);
    document.getElementById('confirmDelete').addEventListener('click', confirmDeleteProduct);

    // Image preview
    document.getElementById('productImage').addEventListener('change', handleImagePreview);

    // Fermer les modals en cliquant à l'extérieur
    window.addEventListener('click', (e) => {
        if (e.target === productModal) closeProductModal();
        if (e.target === deleteModal) closeDeleteModal();
    });
}

// Authentification
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('loginError');

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        currentUser = { username, role: 'admin' };
        localStorage.setItem('adminUser', JSON.stringify(currentUser));
        showDashboard();
        loadProducts();
        updateStats();
        errorElement.style.display = 'none';
    } else {
        errorElement.textContent = 'Nom d\'utilisateur ou mot de passe incorrect';
        errorElement.style.display = 'block';
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('adminUser');
    showLoginScreen();
}

function showLoginScreen() {
    loginScreen.style.display = 'flex';
    dashboard.style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function showDashboard() {
    loginScreen.style.display = 'none';
    dashboard.style.display = 'flex';
}

// Navigation
function switchSection(sectionName) {
    // Mettre à jour les boutons de navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

    // Afficher la section correspondante
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionName).classList.add('active');

    // Charger les données si nécessaire
    if (sectionName === 'products' && products.length === 0) {
        loadProducts();
    } else if (sectionName === 'categories') {
        loadCategories();
    } else if (sectionName === 'stats') {
        updateStats();
    } else if (sectionName === 'social') {
        loadSocialConfig();
    }
}

// Gestion des produits
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}?page=1&limit=100`);
        const data = await response.json();
        
        if (data.products) {
            products = data.products;
            renderProducts(products);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        showNotification('Erreur lors du chargement des produits', 'error');
    }
}

function renderProducts(productsToRender) {
    productsGrid.innerHTML = '';

    if (productsToRender.length === 0) {
        productsGrid.innerHTML = '<p class="placeholder-text">Aucun produit trouvé</p>';
        return;
    }

    productsToRender.forEach(product => {
        const card = createProductCard(product);
        productsGrid.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const imageSrc = product.media && product.media !== '' 
        ? (product.media.startsWith('http') ? product.media : product.media)
        : './hModuTC.jpeg';

    card.innerHTML = `
        <div class="product-image">
            <img src="${imageSrc}" alt="${product.product_name}" onerror="this.src='./hModuTC.jpeg'">
            <div class="product-tag">
                <i class="ri-price-tag-3-line"></i>
                <span>${product.country || 'STATIC MAROC 🇲🇦'}</span>
            </div>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.product_name || 'Z HASH'}</h3>
            <div class="product-category">
                <i class="ri-home-5-line"></i>
                <span>${product.category || 'MOUNTAINS GIANT'}</span>
            </div>
            <div class="product-price">${product.price || '110'}€<span> / ${product.weight || '5'}g</span></div>
            <div class="product-actions">
                <button class="action-btn edit-btn" onclick="editProduct(${product.id})">
                    <i class="ri-edit-line"></i>
                    Modifier
                </button>
                <button class="action-btn delete-btn" onclick="deleteProduct(${product.id}, '${product.product_name}')">
                    <i class="ri-delete-bin-line"></i>
                    Supprimer
                </button>
            </div>
        </div>
    `;

    return card;
}

function handleProductSearch() {
    const searchTerm = productSearch.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.product_name?.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm) ||
        product.country?.toLowerCase().includes(searchTerm)
    );
    renderProducts(filteredProducts);
}

// Modal de produit
function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('productForm');
    const imagePreview = document.getElementById('imagePreview');

    // Réinitialiser le formulaire
    form.reset();
    imagePreview.innerHTML = '';
    document.getElementById('productId').value = '';

    if (productId) {
        // Mode édition
        const product = products.find(p => p.id == productId);
        if (product) {
            modalTitle.textContent = 'Modifier le produit';
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.product_name || '';
            document.getElementById('productPrice').value = product.price || '';
            document.getElementById('productWeight').value = product.weight || '';
            document.getElementById('productCategory').value = product.category || '';
            document.getElementById('productCountry').value = product.country || '';
            document.getElementById('productDescription').value = product.description || '';

            if (product.media) {
                const img = document.createElement('img');
                img.src = product.media.startsWith('http') ? product.media : product.media;
                img.alt = 'Aperçu';
                imagePreview.appendChild(img);
            }
        }
    } else {
        // Mode ajout
        modalTitle.textContent = 'Ajouter un produit';
    }

    modal.style.display = 'block';
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

function handleImagePreview(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('imagePreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Aperçu">`;
        };
        reader.readAsDataURL(file);
    }
}

async function handleProductSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    const productId = document.getElementById('productId').value;
    
    // Ajouter les données du formulaire
    formData.append('product_name', document.getElementById('productName').value);
    formData.append('price', document.getElementById('productPrice').value);
    formData.append('weight', document.getElementById('productWeight').value);
    formData.append('category', document.getElementById('productCategory').value);
    formData.append('country', document.getElementById('productCountry').value);
    formData.append('description', document.getElementById('productDescription').value);

    if (productId) {
        formData.append('id', productId);
    }

    // Ajouter l'image si sélectionnée
    const imageFile = document.getElementById('productImage').files[0];
    if (imageFile) {
        formData.append('media', imageFile);
    }

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showNotification(
                productId ? 'Produit modifié avec succès' : 'Produit ajouté avec succès',
                'success'
            );
            closeProductModal();
            loadProducts();
            updateStats();
        } else {
            showNotification('Erreur lors de l\'enregistrement', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de l\'enregistrement', 'error');
    }
}

function editProduct(productId) {
    openProductModal(productId);
}

function deleteProduct(productId, productName) {
    const modal = document.getElementById('deleteModal');
    const productNameElement = modal.querySelector('.delete-product-name');
    
    productNameElement.textContent = productName;
    modal.dataset.productId = productId;
    modal.style.display = 'block';
}

function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
}

async function confirmDeleteProduct() {
    const modal = document.getElementById('deleteModal');
    const productId = modal.dataset.productId;

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `id=${productId}`
        });

        const result = await response.json();

        if (result.success) {
            showNotification('Produit supprimé avec succès', 'success');
            closeDeleteModal();
            loadProducts();
            updateStats();
        } else {
            showNotification('Erreur lors de la suppression', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de la suppression', 'error');
    }
}

// Statistiques
async function updateStats() {
    try {
        const response = await fetch(`${API_BASE_URL}?page=1&limit=1000`);
        const data = await response.json();
        
        if (data.products) {
            const totalProducts = data.products.length;
            const totalCategories = new Set(data.products.map(p => p.category)).size;
            const totalRevenue = data.products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0);

            document.getElementById('totalProducts').textContent = totalProducts;
            document.getElementById('totalCategories').textContent = totalCategories;
            document.getElementById('totalOrders').textContent = '0'; // À implémenter
            document.getElementById('totalRevenue').textContent = `${totalRevenue.toFixed(2)}€`;
        }
    } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
    }
}

// Utilitaires
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'info') {
    // Créer une notification temporaire
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        ${type === 'success' ? 'background: #28a745;' : ''}
        ${type === 'error' ? 'background: #dc3545;' : ''}
        ${type === 'info' ? 'background: #17a2b8;' : ''}
    `;

    document.body.appendChild(notification);

    // Supprimer après 3 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Styles CSS pour les animations de notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Gestion des réseaux sociaux
function loadSocialConfig() {
    // Charger la configuration depuis localStorage
    const socialConfig = JSON.parse(localStorage.getItem('socialConfig') || '{}');
    
    // Remplir les champs avec les valeurs sauvegardées
    document.getElementById('facebookUrl').value = socialConfig.facebook || '';
    document.getElementById('instagramUrl').value = socialConfig.instagram || '';
    document.getElementById('twitterUrl').value = socialConfig.twitter || '';
    document.getElementById('linkedinUrl').value = socialConfig.linkedin || '';
    document.getElementById('youtubeUrl').value = socialConfig.youtube || '';
    document.getElementById('whatsappNumber').value = socialConfig.whatsapp || '';
}

function handleSocialSave() {
    const socialConfig = {
        facebook: document.getElementById('facebookUrl').value,
        instagram: document.getElementById('instagramUrl').value,
        twitter: document.getElementById('twitterUrl').value,
        linkedin: document.getElementById('linkedinUrl').value,
        youtube: document.getElementById('youtubeUrl').value,
        whatsapp: document.getElementById('whatsappNumber').value
    };

    // Sauvegarder dans localStorage
    localStorage.setItem('socialConfig', JSON.stringify(socialConfig));
    
    showNotification('Configuration des réseaux sociaux sauvegardée avec succès', 'success');
}

// Gestion des catégories
async function loadCategories() {
    try {
        const response = await fetch(CATEGORIES_API_URL);
        const data = await response.json();
        
        if (data.categories) {
            categories = data.categories;
            renderCategories(categories);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        showNotification('Erreur lors du chargement des catégories', 'error');
    }
}

function renderCategories(categoriesToRender) {
    const categoriesList = document.getElementById('categoriesList');
    categoriesList.innerHTML = '';

    if (categoriesToRender.length === 0) {
        categoriesList.innerHTML = '<p class="placeholder-text">Aucune catégorie trouvée</p>';
        return;
    }

    categoriesToRender.forEach(category => {
        const card = createCategoryCard(category);
        categoriesList.appendChild(card);
    });
}

function createCategoryCard(category) {
    const card = document.createElement('div');
    card.className = 'category-card';
    
    card.innerHTML = `
        <div class="category-info">
            <div class="category-icon">
                <i class="ri-book-shelf-line"></i>
            </div>
            <div class="category-details">
                <h3 class="category-name">${category}</h3>
                <p class="category-count">0 produits</p>
            </div>
        </div>
        <div class="category-actions">
            <button class="action-btn delete-btn" onclick="deleteCategory('${category}')">
                <i class="ri-delete-bin-line"></i>
                Supprimer
            </button>
        </div>
    `;

    return card;
}

function openCategoryModal() {
    const categoryName = prompt('Entrez le nom de la nouvelle catégorie:');
    
    if (categoryName && categoryName.trim()) {
        addCategory(categoryName.trim());
    }
}

async function addCategory(categoryName) {
    try {
        const formData = new FormData();
        formData.append('category_name', categoryName);

        const response = await fetch(CATEGORIES_API_URL, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showNotification('Catégorie ajoutée avec succès', 'success');
            loadCategories();
            updateStats();
        } else {
            showNotification(result.error || 'Erreur lors de l\'ajout de la catégorie', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de l\'ajout de la catégorie', 'error');
    }
}

async function deleteCategory(categoryName) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${categoryName}" ? Tous les produits de cette catégorie seront également supprimés.`)) {
        return;
    }

    try {
        const response = await fetch(CATEGORIES_API_URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `category_name=${encodeURIComponent(categoryName)}`
        });

        const result = await response.json();

        if (result.success) {
            showNotification(`Catégorie "${categoryName}" supprimée avec succès`, 'success');
            loadCategories();
            loadProducts();
            updateStats();
        } else {
            showNotification(result.error || 'Erreur lors de la suppression de la catégorie', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de la suppression de la catégorie', 'error');
    }
}