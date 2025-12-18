// C.O.R.E.js Form Validation System
core.validation = {
    // Validation rules registry
    rules: {
        required: (value) => {
            return value && value.trim().length > 0;
        },
        email: (value) => {
            return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        minLength: (value, min) => {
            return !value || value.length >= min;
        },
        maxLength: (value, max) => {
            return !value || value.length <= max;
        },
        pattern: (value, pattern) => {
            return !value || new RegExp(pattern).test(value);
        },
        numeric: (value) => {
            return !value || !isNaN(parseFloat(value));
        },
        integer: (value) => {
            return !value || Number.isInteger(parseFloat(value));
        },
        positive: (value) => {
            return !value || parseFloat(value) > 0;
        },
        range: (value, min, max) => {
            const num = parseFloat(value);
            return !value || (num >= min && num <= max);
        },
        phone: (value) => {
            return !value || /^[\d\s\-\+\(\)]+$/.test(value.replace(/\s/g, ''));
        },
        url: (value) => {
            return !value || /^https?:\/\/.+\..+/.test(value);
        },
        date: (value) => {
            return !value || !isNaN(Date.parse(value));
        },
        password: (value) => {
            // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
            return !value || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
        },
        confirmPassword: (value, originalValue) => {
            return !value || value === originalValue;
        }
    },
    
    // Error messages
    messages: {
        required: 'This field is required',
        email: 'Please enter a valid email address',
        minLength: 'Must be at least {min} characters',
        maxLength: 'Must be no more than {max} characters',
        pattern: 'Please enter a valid format',
        numeric: 'Please enter a valid number',
        integer: 'Please enter a whole number',
        positive: 'Please enter a positive number',
        range: 'Must be between {min} and {max}',
        phone: 'Please enter a valid phone number',
        url: 'Please enter a valid URL',
        date: 'Please enter a valid date',
        password: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number',
        confirmPassword: 'Passwords do not match'
    },
    
    // Main validation function
    validate: (formElement, options = {}) => {
        const errors = {};
        const formData = new FormData(formElement);
        
        for (const [name, value] of formData.entries()) {
            const field = formElement.querySelector(`[name="${name}"]`);
            if (!field) continue;
            
            const fieldRules = this.getFieldRules(field, options.rules);
            const fieldErrors = this.validateField(value, fieldRules, options);
            
            if (fieldErrors.length > 0) {
                errors[name] = fieldErrors;
                this.showFieldErrors(field, fieldErrors);
            } else {
                this.clearFieldErrors(field);
            }
        }
        
        const isValid = Object.keys(errors).length === 0;
        
        if (options.showSummary && !isValid) {
            this.showValidationSummary(errors);
        }
        
        return { isValid, errors };
    },
    
    // Get validation rules for a field
    getFieldRules: (field, globalRules = {}) => {
        const rules = {};
        
        // Get rules from data attributes
        const required = field.getAttribute('data-validate-required');
        const type = field.getAttribute('data-validate-type');
        const min = field.getAttribute('data-validate-min');
        const max = field.getAttribute('data-validate-max');
        const pattern = field.getAttribute('data-validate-pattern');
        const confirm = field.getAttribute('data-validate-confirm');
        
        if (required !== null) rules.required = true;
        if (type) rules[type] = true;
        if (min) rules.minLength = parseInt(min);
        if (max) rules.maxLength = parseInt(max);
        if (pattern) rules.pattern = pattern;
        if (confirm) rules.confirmPassword = confirm;
        
        // Merge with global rules
        const fieldName = field.name || field.id;
        if (globalRules[fieldName]) {
            Object.assign(rules, globalRules[fieldName]);
        }
        
        return rules;
    },
    
    // Validate a single field
    validateField: (value, rules, options = {}) => {
        const errors = [];
        
        for (const [rule, params] of Object.entries(rules)) {
            const ruleFunc = core.validation.rules[rule];
            if (!ruleFunc) continue;
            
            let isValid;
            if (Array.isArray(params)) {
                isValid = ruleFunc(value, ...params);
            } else if (params !== undefined) {
                isValid = ruleFunc(value, params);
            } else {
                isValid = ruleFunc(value);
            }
            
            if (!isValid) {
                const message = core.validation.formatMessage(rule, params, options.messages);
                errors.push(message);
            }
        }
        
        return errors;
    },
    
    // Format error message with parameters
    formatMessage: (rule, params, customMessages = {}) => {
        const message = customMessages[rule] || core.validation.messages[rule];
        
        if (typeof params === 'object' && params !== null) {
            let formatted = message;
            for (const [key, value] of Object.entries(params)) {
                formatted = formatted.replace(new RegExp(`{${key}}`, 'g'), value);
            }
            return formatted;
        }
        
        return message;
    },
    
    // Show errors for a field
    showFieldErrors: (field, errors) => {
        // Remove existing errors
        core.validation.clearFieldErrors(field);
        
        // Add error styling
        field.classList.add('is-invalid');
        
        // Create error container
        const errorContainer = document.createElement('div');
        errorContainer.className = 'invalid-feedback';
        errorContainer.setAttribute('role', 'alert');
        
        errors.forEach(error => {
            const errorItem = document.createElement('div');
            errorItem.textContent = error;
            errorContainer.appendChild(errorItem);
        });
        
        // Insert error container after field
        field.parentNode.insertBefore(errorContainer, field.nextSibling);
    },
    
    // Clear errors for a field
    clearFieldErrors: (field) => {
        field.classList.remove('is-invalid');
        const errorContainer = field.parentNode.querySelector('.invalid-feedback');
        if (errorContainer) {
            errorContainer.remove();
        }
    },
    
    // Show validation summary
    showValidationSummary: (errors) => {
        const errorCount = Object.values(errors).flat().length;
        const message = `Please correct ${errorCount} error${errorCount > 1 ? 's' : ''} before submitting.`;
        
        core.components.toast.show(message, 'danger', 5000);
    },
    
    // Auto-validate on input
    setupAutoValidation: (formElement, options = {}) => {
        const inputs = formElement.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            const eventType = input.tagName === 'SELECT' ? 'change' : 'input';
            
            input.addEventListener(eventType, () => {
                setTimeout(() => {
                    const rules = core.validation.getFieldRules(input, options.rules);
                    const errors = core.validation.validateField(input.value, rules, options);
                    
                    if (errors.length > 0) {
                        core.validation.showFieldErrors(input, errors);
                    } else {
                        core.validation.clearFieldErrors(input);
                    }
                }, 100); // Small delay for better UX
            });
        });
    },
    
    // Setup form with validation
    setupForm: (formElement, options = {}) => {
        const defaultOptions = {
            showSummary: true,
            autoValidate: true,
            preventSubmit: true,
            ...options
        };
        
        // Setup auto-validation
        if (defaultOptions.autoValidate) {
            core.validation.setupAutoValidation(formElement, defaultOptions);
        }
        
        // Handle form submission
        if (defaultOptions.preventSubmit) {
            formElement.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const result = core.validation.validate(formElement, defaultOptions);
                
                if (result.isValid && defaultOptions.onSuccess) {
                    defaultOptions.onSuccess(new FormData(formElement));
                } else if (!result.isValid && defaultOptions.onError) {
                    defaultOptions.onError(result.errors);
                }
            });
        }
        
        return {
            validate: () => core.validation.validate(formElement, defaultOptions),
            reset: () => core.validation.resetForm(formElement)
        };
    },
    
    // Reset form validation
    resetForm: (formElement) => {
        const inputs = formElement.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            core.validation.clearFieldErrors(input);
        });
    }
};
