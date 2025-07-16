// API JavaScript partagée pour synchronisation entre boutique et panel admin
// À utiliser sur les deux sites (boutique et admin)

class SharedAPI {
    constructor() {
        this.storageKey = 'avec_amour_products';
        this.syncKey = 'avec_amour_sync_timestamp';
        this.initStorage();
    }

    initStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            // Données initiales
            const initialProducts = [
                {
                    id: 1,
                    product_name: 'Z HASH',
                    price: '110',
                    weight: '5',
                    category: 'MOUNTAINS GIANT',
                    country: 'STATIC MAROC 🇲🇦',
                    description: 'Produit de qualité premium',
                    media: './hModuTC.jpeg',
                    available: true,
                    stock: 10
                },
                {
                    id: 2,
                    product_name: 'DRY HASH',
                    price: '90',
                    weight: '3',
                    category: 'PREMIUM',
                    country: 'MAROC 🇲🇦',
                    description: 'Hash sec de qualité',
                    media: './dry-hash.jpg',
                    available: true,
                    stock: 15
                }
            ];
            localStorage.setItem(this.storageKey, JSON.stringify(initialProducts));
            this.updateSyncTimestamp();
        }
    }

    updateSyncTimestamp() {
        localStorage.setItem(this.syncKey, Date.now().toString());
    }

    getProducts(page = 1, limit = 100, search = '', category = '') {
        return new Promise((resolve) => {
            const products = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
            let filteredProducts = products;

            // Filtre par disponibilité (pour la boutique)
            filteredProducts = filteredProducts.filter(p => p.available !== false);

            // Recherche
            if (search) {
                filteredProducts = filteredProducts.filter(product => 
                    product.product_name.toLowerCase().includes(search.toLowerCase()) ||
                    product.category.toLowerCase().includes(search.toLowerCase()) ||
                    product.country.toLowerCase().includes(search.toLowerCase())
                );
            }

            // Filtre par catégorie
            if (category) {
                filteredProducts = filteredProducts.filter(product => 
                    product.category.toLowerCase() === category.toLowerCase()
                );
            }

            // Pagination
            const total = filteredProducts.length;
            const offset = (page - 1) * limit;
            const paginatedProducts = filteredProducts.slice(offset, offset + limit);

            resolve({
                products: paginatedProducts,
                total: total,
                page: page,
                limit: limit
            });
        });
    }

    getProduct(id) {
        return new Promise((resolve) => {
            const products = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
            const product = products.find(p => p.id === parseInt(id));
            resolve(product || null);
        });
    }

    createProduct(productData) {
        return new Promise((resolve) => {
            const products = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            
            const newProduct = {
                id: newId,
                product_name: productData.product_name || '',
                price: productData.price || '',
                weight: productData.weight || '',
                category: productData.category || '',
                country: productData.country || '',
                description: productData.description || '',
                media: productData.media || './hModuTC.jpeg',
                available: productData.available !== undefined ? productData.available : true,
                stock: parseInt(productData.stock) || 0,
                created_at: new Date().toISOString()
            };

            products.push(newProduct);
            localStorage.setItem(this.storageKey, JSON.stringify(products));
            this.updateSyncTimestamp();
            
            resolve({
                success: true,
                id: newId,
                product: newProduct
            });
        });
    }

    updateProduct(id, productData) {
        return new Promise((resolve) => {
            const products = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
            const index = products.findIndex(p => p.id === parseInt(id));
            
            if (index !== -1) {
                products[index] = {
                    ...products[index],
                    product_name: productData.product_name || products[index].product_name,
                    price: productData.price || products[index].price,
                    weight: productData.weight || products[index].weight,
                    category: productData.category || products[index].category,
                    country: productData.country || products[index].country,
                    description: productData.description || products[index].description,
                    media: productData.media || products[index].media,
                    available: productData.available !== undefined ? productData.available : products[index].available,
                    stock: productData.stock !== undefined ? parseInt(productData.stock) : products[index].stock,
                    updated_at: new Date().toISOString()
                };

                localStorage.setItem(this.storageKey, JSON.stringify(products));
                this.updateSyncTimestamp();
                
                resolve({
                    success: true,
                    updated: true,
                    product: products[index]
                });
            } else {
                resolve({
                    success: false,
                    error: 'Product not found'
                });
            }
        });
    }

    deleteProduct(id) {
        return new Promise((resolve) => {
            const products = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
            const filteredProducts = products.filter(p => p.id !== parseInt(id));
            
            if (filteredProducts.length < products.length) {
                localStorage.setItem(this.storageKey, JSON.stringify(filteredProducts));
                this.updateSyncTimestamp();
                resolve({
                    success: true
                });
            } else {
                resolve({
                    success: false,
                    error: 'Product not found'
                });
            }
        });
    }

    getCategories() {
        return new Promise((resolve) => {
            const products = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
            const categories = [...new Set(products.map(p => p.category))];
            resolve(categories);
        });
    }

    getStats() {
        return new Promise((resolve) => {
            const products = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
            const availableProducts = products.filter(p => p.available !== false);
            const categories = [...new Set(products.map(p => p.category))];
            const totalStock = products.reduce((sum, p) => sum + (parseInt(p.stock) || 0), 0);
            const totalValue = products.reduce((sum, p) => sum + (parseFloat(p.price) * (parseInt(p.stock) || 0)), 0);
            
            resolve({
                totalProducts: products.length,
                availableProducts: availableProducts.length,
                totalCategories: categories.length,
                totalStock: totalStock,
                totalValue: totalValue.toFixed(2),
                lastSync: localStorage.getItem(this.syncKey) || 'Never'
            });
        });
    }

    // Méthode pour synchroniser avec un autre site
    syncWithOtherSite(otherSiteData) {
        if (otherSiteData && otherSiteData.products) {
            localStorage.setItem(this.storageKey, JSON.stringify(otherSiteData.products));
            this.updateSyncTimestamp();
            return true;
        }
        return false;
    }

    // Méthode pour exporter les données
    exportData() {
        const products = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const syncTimestamp = localStorage.getItem(this.syncKey);
        return {
            products: products,
            sync_timestamp: syncTimestamp,
            export_date: new Date().toISOString()
        };
    }

    // Méthode pour importer les données
    importData(data) {
        if (data && data.products) {
            localStorage.setItem(this.storageKey, JSON.stringify(data.products));
            if (data.sync_timestamp) {
                localStorage.setItem(this.syncKey, data.sync_timestamp);
            }
            return true;
        }
        return false;
    }
}

// Instance globale de l'API partagée
const sharedAPI = new SharedAPI();

// Fonction pour simuler l'API fetch (compatible avec les deux sites)
async function fetchSharedAPI(url, options = {}) {
    const urlObj = new URL(url, window.location.origin);
    const params = new URLSearchParams(urlObj.search);
    
    const method = options.method || 'GET';
    const page = parseInt(params.get('page')) || 1;
    const limit = parseInt(params.get('limit')) || 100;
    const search = params.get('search') || '';
    const category = params.get('category') || '';
    const id = parseInt(params.get('id')) || 0;

    try {
        switch (method) {
            case 'GET':
                if (id) {
                    const product = await sharedAPI.getProduct(id);
                    return {
                        ok: true,
                        json: async () => ({
                            products: product ? [product] : [],
                            total: product ? 1 : 0,
                            page: 1,
                            limit: 1
                        })
                    };
                } else {
                    const result = await sharedAPI.getProducts(page, limit, search, category);
                    return {
                        ok: true,
                        json: async () => result
                    };
                }

            case 'POST':
                const formData = options.body;
                const productData = {};
                
                // Extraire les données du FormData
                for (let [key, value] of formData.entries()) {
                    productData[key] = value;
                }

                if (productData.id && productData.id !== '') {
                    const result = await sharedAPI.updateProduct(productData.id, productData);
                    return {
                        ok: true,
                        json: async () => result
                    };
                } else {
                    const result = await sharedAPI.createProduct(productData);
                    return {
                        ok: true,
                        json: async () => result
                    };
                }

            case 'DELETE':
                const deleteData = new URLSearchParams(options.body);
                const deleteId = parseInt(deleteData.get('id'));
                const deleteResult = await sharedAPI.deleteProduct(deleteId);
                return {
                    ok: true,
                    json: async () => deleteResult
                };

            default:
                return {
                    ok: false,
                    status: 405,
                    json: async () => ({ error: 'Method Not Allowed' })
                };
        }
    } catch (error) {
        return {
            ok: false,
            status: 500,
            json: async () => ({ error: error.message })
        };
    }
}

// Rendre l'API disponible globalement
if (typeof window !== 'undefined') {
    window.sharedAPI = sharedAPI;
    window.fetchSharedAPI = fetchSharedAPI;
}