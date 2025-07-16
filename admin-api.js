// API JavaScript statique pour Netlify
// Remplace l'API PHP pour permettre le déploiement sur Netlify

class AdminAPI {
    constructor() {
        this.storageKey = 'avec_amour_products';
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
                    media: './hModuTC.jpeg'
                },
                {
                    id: 2,
                    product_name: 'DRY HASH',
                    price: '90',
                    weight: '3',
                    category: 'PREMIUM',
                    country: 'MAROC 🇲🇦',
                    description: 'Hash sec de qualité',
                    media: './dry-hash.jpg'
                }
            ];
            localStorage.setItem(this.storageKey, JSON.stringify(initialProducts));
        }
    }

    getProducts(page = 1, limit = 100, search = '') {
        return new Promise((resolve) => {
            const products = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
            let filteredProducts = products;

            // Recherche
            if (search) {
                filteredProducts = products.filter(product => 
                    product.product_name.toLowerCase().includes(search.toLowerCase()) ||
                    product.category.toLowerCase().includes(search.toLowerCase()) ||
                    product.country.toLowerCase().includes(search.toLowerCase())
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
                media: productData.media || './hModuTC.jpeg'
            };

            products.push(newProduct);
            localStorage.setItem(this.storageKey, JSON.stringify(products));
            
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
                    media: productData.media || products[index].media
                };

                localStorage.setItem(this.storageKey, JSON.stringify(products));
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

    getStats() {
        return new Promise((resolve) => {
            const products = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
            const categories = [...new Set(products.map(p => p.category))];
            
            resolve({
                totalProducts: products.length,
                totalCategories: categories.length,
                totalOrders: 0, // Pas d'orders dans cette version
                totalRevenue: '0€' // Pas de revenus dans cette version
            });
        });
    }
}

// Instance globale de l'API
const adminAPI = new AdminAPI();

// Fonction pour simuler l'API fetch
async function fetchAPI(url, options = {}) {
    const urlObj = new URL(url, window.location.origin);
    const params = new URLSearchParams(urlObj.search);
    
    const method = options.method || 'GET';
    const page = parseInt(params.get('page')) || 1;
    const limit = parseInt(params.get('limit')) || 100;
    const search = params.get('search') || '';
    const id = parseInt(params.get('id')) || 0;

    try {
        switch (method) {
            case 'GET':
                if (id) {
                    const product = await adminAPI.getProduct(id);
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
                    const result = await adminAPI.getProducts(page, limit, search);
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
                    const result = await adminAPI.updateProduct(productData.id, productData);
                    return {
                        ok: true,
                        json: async () => result
                    };
                } else {
                    const result = await adminAPI.createProduct(productData);
                    return {
                        ok: true,
                        json: async () => result
                    };
                }

            case 'DELETE':
                const deleteData = new URLSearchParams(options.body);
                const deleteId = parseInt(deleteData.get('id'));
                const deleteResult = await adminAPI.deleteProduct(deleteId);
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

// Remplacer la fonction fetch globale pour l'admin
if (typeof window !== 'undefined') {
    window.fetchAPI = fetchAPI;
}