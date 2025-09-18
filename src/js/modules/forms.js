/**
 * Form Manager Module
 * Handles contact form functionality and validation
 */

class FormManager {
    constructor() {
        this.form = null;
        this.isSubmitting = false;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.form = document.getElementById('contact-form');
            if (this.form) {
                this.bindEvents();
                this.initFormValidation();
            }
        });
    }

    /**
     * Bind form events
     */
    bindEvents() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add input event listeners for real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    /**
     * Handle form submission
     * @param {Event} e - Submit event
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        if (!this.validateForm()) {
            this.showMessage('Por favor, corrija os erros antes de enviar.', 'error');
            return;
        }

        this.isSubmitting = true;
        this.showLoading(true);

        try {
            const formData = new FormData(this.form);
            
            // Remove honeypot field
            formData.delete('_gotcha');
            
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                this.showMessage('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
                this.form.reset();
                this.clearAllErrors();
            } else {
                throw new Error('Erro no servidor');
            }
        } catch (error) {
            // Handle form submission error
            this.showMessage('Erro ao enviar mensagem. Tente novamente mais tarde.', 'error');
        } finally {
            this.isSubmitting = false;
            this.showLoading(false);
        }
    }

    /**
     * Validate entire form
     * @returns {boolean} Is form valid
     */
    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Validate individual field
     * @param {HTMLElement} field - Input field
     * @returns {boolean} Is field valid
     */
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório.';
        }

        // Email validation
        if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, insira um email válido.';
            }
        }

        // Phone validation (optional)
        if (fieldName === 'phone' && value) {
            const phoneRegex = /^[\d\s\(\)\-\+]+$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, insira um telefone válido.';
            }
        }

        // Name validation
        if (fieldName === 'name' && value) {
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Nome deve ter pelo menos 2 caracteres.';
            }
        }

        // Message validation
        if (fieldName === 'message' && value) {
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Mensagem deve ter pelo menos 10 caracteres.';
            }
        }

        this.showFieldError(field, isValid ? '' : errorMessage);
        return isValid;
    }

    /**
     * Show field error
     * @param {HTMLElement} field - Input field
     * @param {string} message - Error message
     */
    showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        let errorElement = formGroup.querySelector('.field-error');

        if (message) {
            if (!errorElement) {
                errorElement = document.createElement('span');
                errorElement.className = 'field-error';
                formGroup.appendChild(errorElement);
            }
            errorElement.textContent = message;
            field.classList.add('error');
        } else {
            if (errorElement) {
                errorElement.remove();
            }
            field.classList.remove('error');
        }
    }

    /**
     * Clear field error
     * @param {HTMLElement} field - Input field
     */
    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.field-error');
        
        if (errorElement) {
            errorElement.remove();
        }
        field.classList.remove('error');
    }

    /**
     * Clear all form errors
     */
    clearAllErrors() {
        const errorElements = this.form.querySelectorAll('.field-error');
        const errorFields = this.form.querySelectorAll('.error');
        
        errorElements.forEach(element => element.remove());
        errorFields.forEach(field => field.classList.remove('error'));
    }

    /**
     * Show form message
     * @param {string} message - Message text
     * @param {string} type - Message type (success/error)
     */
    showMessage(message, type) {
        const statusElement = document.getElementById('form-status');
        if (!statusElement) return;

        statusElement.textContent = message;
        statusElement.className = `form-message ${type}`;
        statusElement.style.display = 'block';

        // Hide message after 5 seconds
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 5000);
    }

    /**
     * Show/hide loading state
     * @param {boolean} show - Show loading
     */
    showLoading(show) {
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (!submitButton) return;

        if (show) {
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            submitButton.classList.add('loading');
        } else {
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Mensagem';
            submitButton.classList.remove('loading');
        }
    }

    /**
     * Initialize floating labels
     */
    initFormValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Set placeholder from data attribute
            const placeholder = input.getAttribute('data-placeholder');
            if (placeholder) {
                input.setAttribute('placeholder', placeholder);
            }
        });
    }
}

// Initialize Form Manager
const formManager = new FormManager();

export default formManager;