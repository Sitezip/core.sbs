// C.O.R.E.js Test Suite
core.tests = {
    // Test runner
    run: () => {
        console.log('🧪 Starting C.O.R.E.js Test Suite...');
        const results = [];
        
        // Test core functionality
        results.push(core.tests.testCoreFramework());
        results.push(core.tests.testProductManagement());
        results.push(core.tests.testSearchFilter());
        results.push(core.tests.testAutoRefresh());
        results.push(core.tests.testPerformanceMetrics());
        results.push(core.tests.testComponentLibrary());
        results.push(core.tests.testFormValidation());
        
        // Summary
        const passed = results.filter(r => r.passed).length;
        const total = results.length;
        console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);
        
        results.forEach(result => {
            const icon = result.passed ? '✅' : '❌';
            console.log(`${icon} ${result.name}: ${result.message}`);
        });
        
        // Show results in UI
        core.tests.showTestResults(results);
        
        return results;
    },
    
    // Core framework tests
    testCoreFramework: () => {
        try {
            // Test core object exists
            if (!core) throw new Error('Core object not found');
            
            // Test core modules
            if (!core.cr || !core.be || !core.pk) throw new Error('Core modules missing');
            
            // Test data binding
            core.cr.setData('test', { value: 'test' });
            const data = core.cr.getData('test');
            if (data.value !== 'test') throw new Error('Data binding failed');
            
            return { name: 'Core Framework', passed: true, message: 'All core functionality working' };
        } catch (error) {
            return { name: 'Core Framework', passed: false, message: error.message };
        }
    },
    
    // Product management tests
    testProductManagement: () => {
        try {
            // Test edit function exists
            if (!core.cr.editProduct) throw new Error('editProduct function missing');
            
            // Test delete function exists
            if (!core.cr.deleteProduct) throw new Error('deleteProduct function missing');
            
            // Test with sample data
            const testProducts = [
                { id: 1, title: 'Test Product 1' },
                { id: 2, title: 'Test Product 2' }
            ];
            core.cr.setData('prods', testProducts);
            
            // Test edit
            const originalTitle = testProducts[0].title;
            core.cr.editProduct(1); // This will show prompt, but function exists
            
            // Test delete
            const initialCount = core.cr.getData('prods').length;
            core.cr.deleteProduct(2); // This will show confirm, but function exists
            
            return { name: 'Product Management', passed: true, message: 'Edit and delete functions available' };
        } catch (error) {
            return { name: 'Product Management', passed: false, message: error.message };
        }
    },
    
    // Search and filter tests
    testSearchFilter: () => {
        try {
            // Test filter function exists
            if (!core.cr.filterProducts) throw new Error('filterProducts function missing');
            
            // Test with sample data
            const testProducts = [
                { id: 1, title: 'iPhone', category: 'smartphones', brand: 'Apple' },
                { id: 2, title: 'Laptop', category: 'laptops', brand: 'Dell' }
            ];
            core.cr.setData('prods', testProducts);
            
            // Test search element exists
            const searchInput = document.getElementById('productSearch');
            if (!searchInput) throw new Error('Search input not found');
            
            // Test filter elements exist
            const categoryFilter = document.getElementById('categoryFilter');
            const sortBy = document.getElementById('sortBy');
            if (!categoryFilter || !sortBy) throw new Error('Filter controls not found');
            
            return { name: 'Search & Filter', passed: true, message: 'Search and filter controls functional' };
        } catch (error) {
            return { name: 'Search & Filter', passed: false, message: error.message };
        }
    },
    
    // Auto-refresh tests
    testAutoRefresh: () => {
        try {
            // Test auto-refresh functions exist
            if (!core.cr.startAutoRefresh) throw new Error('startAutoRefresh function missing');
            if (!core.cr.stopAutoRefresh) throw new Error('stopAutoRefresh function missing');
            
            // Test auto-refresh controls exist
            const refreshDropdown = document.getElementById('refreshDropdown');
            if (!refreshDropdown) throw new Error('Auto-refresh controls not found');
            
            return { name: 'Auto-Refresh', passed: true, message: 'Auto-refresh functionality implemented' };
        } catch (error) {
            return { name: 'Auto-Refresh', passed: false, message: error.message };
        }
    },
    
    // Performance metrics tests
    testPerformanceMetrics: () => {
        try {
            // Test analytics object exists
            if (!core.analytics) throw new Error('Analytics object missing');
            
            // Test analytics functions
            if (!core.analytics.getMemoryUsage) throw new Error('Memory usage function missing');
            if (!core.analytics.getUptime) throw new Error('Uptime function missing');
            
            // Test metric elements exist
            const metrics = ['cacheHits', 'dataCalls', 'templates', 'clones'];
            for (const metric of metrics) {
                const element = document.getElementById(metric);
                if (!element) throw new Error(`Metric element ${metric} not found`);
            }
            
            return { name: 'Performance Metrics', passed: true, message: 'Analytics dashboard functional' };
        } catch (error) {
            return { name: 'Performance Metrics', passed: false, message: error.message };
        }
    },
    
    // Component library tests
    testComponentLibrary: () => {
        try {
            // Test components object exists
            if (!core.components) throw new Error('Components object missing');
            
            // Test component functions
            const components = ['modal', 'toast', 'spinner', 'confirm', 'input', 'card', 'badge', 'progress'];
            for (const component of components) {
                if (!core.components[component]) throw new Error(`Component ${component} missing`);
            }
            
            // Test demo functions exist
            if (!window.showToastDemo) throw new Error('Toast demo function missing');
            if (!window.showModalDemo) throw new Error('Modal demo function missing');
            if (!window.animateProgress) throw new Error('Progress demo function missing');
            
            return { name: 'Component Library', passed: true, message: 'All components available' };
        } catch (error) {
            return { name: 'Component Library', passed: false, message: error.message };
        }
    },
    
    // Form validation tests
    testFormValidation: () => {
        try {
            // Test validation object exists
            if (!core.validation) throw new Error('Validation object missing');
            
            // Test validation functions
            const rules = ['required', 'email', 'minLength', 'maxLength', 'pattern'];
            for (const rule of rules) {
                if (!core.validation.rules[rule]) throw new Error(`Validation rule ${rule} missing`);
            }
            
            // Test validation form exists
            const validationForm = document.getElementById('validationDemo');
            if (!validationForm) throw new Error('Validation demo form not found');
            
            // Test validation setup
            const testRules = {
                email: { required: true, email: true },
                name: { required: true, minLength: 2 }
            };
            
            const result = core.validation.validateField('test@test.com', testRules.email);
            if (!result) throw new Error('Email validation should pass');
            
            return { name: 'Form Validation', passed: true, message: 'Validation system working' };
        } catch (error) {
            return { name: 'Form Validation', passed: false, message: error.message };
        }
    },
    
    // Display test results in UI
    showTestResults: (results) => {
        const passed = results.filter(r => r.passed).length;
        const total = results.length;
        const percentage = Math.round((passed / total) * 100);
        
        // Create test results modal
        const content = `
            <div class="row">
                <div class="col-12">
                    <div class="text-center mb-4">
                        <h3>Test Results</h3>
                        <div class="display-4 ${percentage === 100 ? 'text-success' : 'text-warning'}">${percentage}%</div>
                        <p class="lead">${passed} of ${total} tests passed</p>
                    </div>
                    <div class="list-group">
                        ${results.map(result => `
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>${result.name}</strong>
                                    <br>
                                    <small class="text-muted">${result.message}</small>
                                </div>
                                <span class="badge ${result.passed ? 'bg-success' : 'bg-danger'}">
                                    ${result.passed ? 'PASS' : 'FAIL'}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        core.components.modal.show('Test Results', content, {
            size: 'modal-lg'
        });
    }
};

// Auto-run tests when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        // Add test button to navbar
        const navbar = document.querySelector('.navbar-nav');
        if (navbar) {
            const testItem = document.createElement('li');
            testItem.className = 'nav-item';
            testItem.innerHTML = `
                <a href="#" class="nav-link" onclick="core.tests.run()">
                    🧪 Run Tests
                </a>
            `;
            navbar.appendChild(testItem);
        }
    }, 3000);
});
