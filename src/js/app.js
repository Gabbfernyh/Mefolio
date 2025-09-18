/**
 * Main Application Entry Point
 * Gabriel Fernandes Portfolio
 * 
 * This file orchestrates all the modules and initializes the application
 */

// Import all modules
import swiperManager from './modules/swiper.js';
import themeManager from './modules/theme.js';
import animationManager from './modules/animations.js';
import navigationManager from './modules/navigation.js';
import formManager from './modules/forms.js';
import fabManager from './modules/fab.js';

/**
 * Main Application Class
 */
class App {
    constructor() {
        this.modules = {
            swiper: swiperManager,
            theme: themeManager,
            animations: animationManager,
            navigation: navigationManager,
            forms: formManager,
            fab: fabManager
        };
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeModules();
            this.bindGlobalEvents();
            this.initPerformanceOptimizations();
        });
    }

    /**
     * Initialize all modules
     */
    initializeModules() {
        // Modules are already initialized in their constructors
        // This method can be used for additional setup if needed
        
        // Set up inter-module communication if needed
        this.setupModuleCommunication();
    }

    /**
     * Set up communication between modules
     */
    setupModuleCommunication() {
        // Example: Listen for theme changes to update other modules
        document.addEventListener('themeChanged', (e) => {
            const { theme } = e.detail;
            
            // Notify other modules about theme change if needed
            // This is where you could update module-specific theme settings
        });
    }

    /**
     * Bind global application events
     */
    bindGlobalEvents() {
        // Global error handling
        window.addEventListener('error', (e) => {
            this.handleGlobalError(e.error);
        });

        // Global unhandled promise rejection handling
        window.addEventListener('unhandledrejection', (e) => {
            this.handleGlobalError(e.reason);
        });

        // Performance monitoring
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    // Performance data available here if needed
                }, 0);
            });
        }

        // Service Worker registration (if available)
        this.registerServiceWorker();
    }

    /**
     * Handle global errors gracefully
     * @param {Error} error - The error object
     */
    handleGlobalError(error) {
        // In production, you might want to send errors to a logging service
        // For now, we'll just prevent the application from crashing
        
        if (error.name === 'ChunkLoadError') {
            // Handle dynamic import errors
            window.location.reload();
        }
    }

    /**
     * Initialize performance optimizations
     */
    initPerformanceOptimizations() {
        // Lazy load images
        this.initLazyLoading();
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Initialize intersection observer for animations
        this.initIntersectionObserver();
    }

    /**
     * Initialize lazy loading for images
     */
    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    /**
     * Preload critical resources
     */
    preloadCriticalResources() {
        // Preload hero image if it exists
        const heroImage = document.querySelector('.avatar-img');
        if (heroImage && heroImage.src) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = heroImage.src;
            link.as = 'image';
            document.head.appendChild(link);
        }
    }

    /**
     * Initialize intersection observer for better animation performance
     */
    initIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px'
            });

            // Observe elements that should animate on scroll
            const animatableElements = document.querySelectorAll('[data-animate]');
            animatableElements.forEach(el => animationObserver.observe(el));
        }
    }

    /**
     * Register service worker for offline functionality
     */
    registerServiceWorker() {
        // Service Worker desabilitado durante desenvolvimento
        return;
        
        if ('serviceWorker' in navigator && 'production' === 'production') {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        // SW registered successfully
                    })
                    .catch(registrationError => {
                        // SW registration failed
                    });
            });
        }
    }

    /**
     * Get module instance
     * @param {string} moduleName - Name of the module
     * @returns {Object} Module instance
     */
    getModule(moduleName) {
        return this.modules[moduleName];
    }

    /**
     * Destroy the application and clean up
     */
    destroy() {
        // Clean up modules
        Object.values(this.modules).forEach(module => {
            if (typeof module.destroy === 'function') {
                module.destroy();
            }
        });
    }
}

// Initialize the application
const app = new App();

// Make app globally available for debugging
if (typeof window !== 'undefined') {
    window.MefolioApp = app;
}

export default app;
