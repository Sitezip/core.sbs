// C.O.R.E.js Component Library - Reusable UI Components
core.components = {
    // Modal Component
    modal: {
        show: (title, content, options = {}) => {
            const modalId = 'modal-' + Date.now();
            const modal = document.createElement('div');
            modal.className = 'modal fade';
            modal.id = modalId;
            modal.innerHTML = `
                <div class="modal-dialog ${options.size || ''}">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            ${content}
                        </div>
                        ${options.footer ? `<div class="modal-footer">${options.footer}</div>` : ''}
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();
            
            modal.addEventListener('hidden.bs.modal', () => {
                document.body.removeChild(modal);
            });
            
            return bsModal;
        }
    },
    
    // Toast Notification Component
    toast: {
        show: (message, type = 'info', duration = 3000) => {
            const toastId = 'toast-' + Date.now();
            const toastContainer = document.getElementById('toast-container') || (() => {
                const container = document.createElement('div');
                container.id = 'toast-container';
                container.className = 'position-fixed top-0 end-0 p-3';
                container.style.zIndex = '9999';
                document.body.appendChild(container);
                return container;
            })();
            
            const toast = document.createElement('div');
            toast.className = `toast align-items-center text-white bg-${type} border-0`;
            toast.id = toastId;
            toast.setAttribute('role', 'alert');
            toast.innerHTML = `
                <div class="d-flex">
                    <div class="toast-body">${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            `;
            
            toastContainer.appendChild(toast);
            const bsToast = new bootstrap.Toast(toast);
            bsToast.show();
            
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, duration);
            
            return bsToast;
        }
    },
    
    // Loading Spinner Component
    spinner: {
        show: (target, message = 'Loading...') => {
            const spinner = document.createElement('div');
            spinner.className = 'd-flex justify-content-center align-items-center p-4';
            spinner.innerHTML = `
                <div class="spinner-border text-primary me-2" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <span>${message}</span>
            `;
            
            const targetElement = typeof target === 'string' ? document.getElementById(target) : target;
            if (targetElement) {
                targetElement.appendChild(spinner);
                return spinner;
            }
        },
        
        hide: (spinner) => {
            if (spinner && spinner.parentNode) {
                spinner.parentNode.removeChild(spinner);
            }
        }
    },
    
    // Confirm Dialog Component
    confirm: {
        show: (message, title = 'Confirm', options = {}) => {
            return new Promise((resolve) => {
                const modal = core.components.modal.show(title, `
                    <p>${message}</p>
                    <div class="d-flex gap-2 justify-content-end">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            ${options.cancelText || 'Cancel'}
                        </button>
                        <button type="button" class="btn btn-${options.type || 'primary'}" id="confirm-btn">
                            ${options.confirmText || 'Confirm'}
                        </button>
                    </div>
                `, { footer: true });
                
                const confirmBtn = document.getElementById('confirm-btn');
                confirmBtn.addEventListener('click', () => {
                    modal.hide();
                    resolve(true);
                });
                
                modal._element.addEventListener('hidden.bs.modal', () => {
                    resolve(false);
                });
            });
        }
    },
    
    // Form Input Component
    input: {
        create: (config) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'mb-3';
            
            const label = document.createElement('label');
            label.className = 'form-label';
            label.textContent = config.label;
            if (config.required) label.innerHTML += ' <span class="text-danger">*</span>';
            
            const input = document.createElement('input');
            input.type = config.type || 'text';
            input.className = `form-control ${config.class || ''}`;
            input.id = config.id;
            input.name = config.name || config.id;
            input.placeholder = config.placeholder || '';
            input.required = config.required || false;
            
            if (config.value) input.value = config.value;
            if (config.maxLength) input.maxLength = config.maxLength;
            if (config.pattern) input.pattern = config.pattern;
            
            wrapper.appendChild(label);
            wrapper.appendChild(input);
            
            if (config.help) {
                const help = document.createElement('div');
                help.className = 'form-text text-muted';
                help.textContent = config.help;
                wrapper.appendChild(help);
            }
            
            return wrapper;
        },
        
        validate: (input, rules) => {
            const errors = [];
            const value = input.value.trim();
            
            if (rules.required && !value) {
                errors.push('This field is required');
            }
            
            if (rules.minLength && value.length < rules.minLength) {
                errors.push(`Minimum ${rules.minLength} characters required`);
            }
            
            if (rules.maxLength && value.length > rules.maxLength) {
                errors.push(`Maximum ${rules.maxLength} characters allowed`);
            }
            
            if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errors.push('Please enter a valid email address');
            }
            
            if (rules.pattern && value && !new RegExp(rules.pattern).test(value)) {
                errors.push(rules.message || 'Invalid format');
            }
            
            return errors;
        }
    },
    
    // Card Component
    card: {
        create: (config) => {
            const card = document.createElement('div');
            card.className = `card ${config.class || ''}`;
            card.innerHTML = `
                ${config.image ? `<img src="${config.image}" class="card-img-top" alt="${config.alt || ''}">` : ''}
                <div class="card-body">
                    ${config.title ? `<h5 class="card-title">${config.title}</h5>` : ''}
                    ${config.subtitle ? `<h6 class="card-subtitle mb-2 text-muted">${config.subtitle}</h6>` : ''}
                    ${config.text ? `<p class="card-text">${config.text}</p>` : ''}
                    ${config.footer ? `<div class="card-footer">${config.footer}</div>` : ''}
                </div>
            `;
            return card;
        }
    },
    
    // Badge Component
    badge: {
        create: (text, type = 'primary', options = {}) => {
            const badge = document.createElement('span');
            badge.className = `badge bg-${type} ${options.class || ''}`;
            badge.textContent = text;
            
            if (options.pill) badge.classList.add('rounded-pill');
            if (options.size) badge.classList.add(`bg-${options.size}`);
            
            return badge;
        }
    },
    
    // Progress Component
    progress: {
        create: (value, max = 100, options = {}) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'progress mb-3';
            
            const bar = document.createElement('div');
            bar.className = `progress-bar ${options.class || ''}`;
            bar.style.width = `${(value / max) * 100}%`;
            bar.setAttribute('role', 'progressbar');
            bar.setAttribute('aria-valuenow', value);
            bar.setAttribute('aria-valuemin', 0);
            bar.setAttribute('aria-valuemax', max);
            
            if (options.animated) bar.classList.add('progress-bar-animated');
            if (options.striped) bar.classList.add('progress-bar-striped');
            
            bar.textContent = options.showLabel ? `${Math.round((value / max) * 100)}%` : '';
            
            wrapper.appendChild(bar);
            return wrapper;
        }
    }
};
