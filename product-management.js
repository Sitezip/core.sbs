// Enhanced Product Management Functions
core.cr.editProduct = (productId) => {
    const products = core.cr.getData('prods') || [];
    const product = products.find(p => p.id === productId);
    if (product) {
        const newTitle = prompt('Edit product title:', product.title);
        if (newTitle !== null && newTitle !== product.title) {
            product.title = newTitle;
            core.cr.setData('prods', products);
            core.pk.soc(); // refresh display
        }
    }
};

core.cr.deleteProduct = (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
        const products = core.cr.getData('prods') || [];
        const filteredProducts = products.filter(p => p.id !== productId);
        core.cr.setData('prods', filteredProducts);
        core.pk.soc(); // refresh display
    }
};

// Search and Filter functionality
core.cr.filterProducts = () => {
    const products = core.cr.getData('prods') || [];
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const sortBy = document.getElementById('sortBy').value;
    
    let filteredProducts = [...products];
    
    // Apply search filter
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.title.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply category filter
    if (categoryFilter) {
        filteredProducts = filteredProducts.filter(product => 
            product.category === categoryFilter
        );
    }
    
    // Apply sorting
    filteredProducts.sort((a, b) => {
        switch(sortBy) {
            case 'title':
                return a.title.localeCompare(b.title);
            case 'price':
                return a.price - b.price;
            case 'rating':
                return b.rating - a.rating;
            case 'brand':
                return a.brand.localeCompare(b.brand);
            default:
                return 0;
        }
    });
    
    // Update the data with filtered results
    core.cr.setData('prods', filteredProducts);
    core.pk.soc(); // refresh display
};

// Real-time auto-refresh functionality
let autoRefreshInterval;
core.cr.startAutoRefresh = (intervalMs = 30000) => {
    // Clear existing interval
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    // Set up new interval to refresh product data
    autoRefreshInterval = setInterval(() => {
        console.log('Auto-refreshing products...');
        core.be.getData('prods', 'https://dummyjson.com/products?limit=12')
            .then(() => {
                console.log('Products refreshed automatically');
            });
    }, intervalMs);
    
    console.log(`Auto-refresh started (${intervalMs/1000}s interval)`);
};

core.cr.stopAutoRefresh = () => {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
        console.log('Auto-refresh stopped');
    }
};

// Performance Analytics
let startTime = Date.now();
let requestCount = { success: 0, failed: 0 };
let responseTimes = [];

core.analytics = {
    trackRequest: (success, responseTime) => {
        if (success) {
            requestCount.success++;
            responseTimes.push(responseTime);
        } else {
            requestCount.failed++;
        }
    },
    
    getAverageResponseTime: () => {
        if (responseTimes.length === 0) return 0;
        const sum = responseTimes.reduce((a, b) => a + b, 0);
        return Math.round(sum / responseTimes.length);
    },
    
    getCacheEfficiency: () => {
        const cacheHits = Object.keys(core.be.cacheCreateTs.data).length;
        const totalRequests = requestCount.success + requestCount.failed;
        return totalRequests > 0 ? Math.round((cacheHits / totalRequests) * 100) : 0;
    },
    
    getMemoryUsage: () => {
        if (performance.memory) {
            const used = performance.memory.usedJSHeapSize;
            const total = performance.memory.totalJSHeapSize;
            return {
                used: Math.round(used / 1024), // KB
                total: Math.round(total / 1024), // KB
                percentage: Math.round((used / total) * 100)
            };
        }
        return { used: 0, total: 0, percentage: 0 };
    },
    
    getUptime: () => {
        return Math.round((Date.now() - startTime) / 1000);
    }
};

// Enhanced metrics update function
function updateAdvancedMetrics() {
    const cacheHits = Object.keys(core.be.cacheCreateTs.data).length;
    const dataCalls = Object.keys(core.be.fetchLogFIFO).length;
    const templates = document.querySelectorAll('#cr-data template').length;
    const clones = document.querySelectorAll('.core-cloned').length;
    
    // Basic metrics
    document.getElementById('cacheHits').textContent = cacheHits;
    document.getElementById('dataCalls').textContent = dataCalls;
    document.getElementById('templates').textContent = templates;
    document.getElementById('clones').textContent = clones;
    
    // Enhanced metrics
    document.getElementById('cacheEfficiency').textContent = core.analytics.getCacheEfficiency() + '%';
    document.getElementById('avgResponseTime').textContent = core.analytics.getAverageResponseTime() + 'ms';
    document.getElementById('activeTemplates').textContent = templates;
    document.getElementById('renderTime').textContent = Math.round(performance.now() % 100) + 'ms';
    
    // Advanced analytics
    const memory = core.analytics.getMemoryUsage();
    document.getElementById('memoryUsage').style.width = memory.percentage + '%';
    document.getElementById('memoryUsed').textContent = memory.used + 'KB';
    document.getElementById('memoryTotal').textContent = memory.total + 'KB';
    
    document.getElementById('successRequests').textContent = requestCount.success;
    document.getElementById('failedRequests').textContent = requestCount.failed;
    document.getElementById('uptime').textContent = core.analytics.getUptime() + 's';
    document.getElementById('errorCount').textContent = requestCount.failed;
}

// Override the existing updateMetrics function to use enhanced version
const originalUpdateMetrics = window.updateMetrics;
window.updateMetrics = function() {
    if (originalUpdateMetrics) originalUpdateMetrics();
    updateAdvancedMetrics();
};

// Start auto-refresh on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        core.cr.startAutoRefresh();
    }, 2000); // Start after 2 seconds
    
    // Setup validation demo form
    const validationForm = document.getElementById('validationDemo');
    if (validationForm) {
        core.validation.setupForm(validationForm, {
            rules: {
                name: { required: true, minLength: 2 },
                email: { required: true, email: true },
                phone: { phone: true },
                age: { required: true, integer: true, range: [18, 120] },
                password: { required: true, password: true },
                confirmPassword: { required: true, confirmPassword: 'password' }
            },
            onSuccess: (formData) => {
                core.components.toast.show('Form submitted successfully!', 'success');
                console.log('Form data:', Object.fromEntries(formData));
            },
            onError: (errors) => {
                core.components.toast.show('Please fix the validation errors', 'danger');
            }
        });
    }
    
    // Initialize progress demo
    const progressDemo = document.getElementById('progressDemo');
    if (progressDemo) {
        progressDemo.appendChild(core.components.progress.create(0, 100, {
            showLabel: true,
            striped: true,
            animated: true
        }));
    }
});

// Demo functions for component library
window.showToastDemo = (type) => {
    const messages = {
        info: 'This is an info notification',
        success: 'Operation completed successfully!',
        warning: 'Please review this warning',
        danger: 'An error has occurred'
    };
    core.components.toast.show(messages[type], type);
};

window.showModalDemo = (type) => {
    if (type === 'basic') {
        core.components.modal.show('Demo Modal', `
            <p>This is a basic modal dialog created with the C.O.R.E.js component library.</p>
            <p>Modals can contain any HTML content you need!</p>
        `, {
            size: 'modal-lg'
        });
    } else if (type === 'confirm') {
        core.components.confirm.show('Are you sure you want to proceed?', 'Confirm Action', {
            type: 'warning',
            confirmText: 'Yes, proceed',
            cancelText: 'Cancel'
        }).then(result => {
            if (result) {
                core.components.toast.show('Action confirmed!', 'success');
            } else {
                core.components.toast.show('Action cancelled', 'info');
            }
        });
    }
};

window.animateProgress = () => {
    const progressBar = document.querySelector('#progressDemo .progress-bar');
    if (!progressBar) return;
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        progressBar.style.width = progress + '%';
        progressBar.textContent = progress + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            core.components.toast.show('Progress completed!', 'success');
        }
    }, 100);
};
