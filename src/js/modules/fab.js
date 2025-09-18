/**
 * FAB (Floating Action Button) Manager Module
 * Handles mobile FAB menu functionality
 */

class FABManager {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.bindEvents();
            this.createFABMenu();
        });
    }

    /**
     * Bind FAB events
     */
    bindEvents() {
        const fabButton = document.querySelector('.fab-button');
        
        if (fabButton) {
            fabButton.addEventListener('click', () => this.toggle());
        }

        // Close FAB menu when clicking outside
        document.addEventListener('click', (e) => {
            const fabContainer = document.querySelector('.fab-container');
            if (this.isOpen && fabContainer && !fabContainer.contains(e.target)) {
                this.close();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    /**
     * Create FAB menu dynamically
     */
    createFABMenu() {
        const fabContainer = document.querySelector('.fab-container');
        if (!fabContainer) return;

        const fabMenu = document.createElement('div');
        fabMenu.className = 'fab-menu';
        
        const menuItems = [
            {
                icon: 'fab fa-whatsapp',
                text: 'WhatsApp',
                href: 'https://wa.me/5511999999999',
                color: '#25d366'
            },
            {
                icon: 'fab fa-instagram',
                text: 'Instagram',
                href: 'https://instagram.com/gabbfernyh',
                color: '#e4405f'
            },
            {
                icon: 'fab fa-github',
                text: 'GitHub',
                href: 'https://github.com/Gabbfernyh',
                color: '#333'
            },
            {
                icon: 'fas fa-envelope',
                text: 'Email',
                href: 'mailto:bielmgfv.python@gmail.com',
                color: '#ea4335'
            }
        ];

        menuItems.forEach(item => {
            const menuItem = this.createMenuItem(item);
            fabMenu.appendChild(menuItem);
        });

        fabContainer.appendChild(fabMenu);
    }

    /**
     * Create individual menu item
     * @param {Object} item - Menu item data
     * @returns {HTMLElement} Menu item element
     */
    createMenuItem(item) {
        const menuItem = document.createElement('a');
        menuItem.className = 'fab-menu-item';
        menuItem.href = item.href;
        menuItem.target = '_blank';
        menuItem.rel = 'noopener noreferrer';
        
        menuItem.innerHTML = `
            <i class="${item.icon}" style="color: ${item.color}"></i>
            <span>${item.text}</span>
        `;

        menuItem.addEventListener('click', () => {
            this.close();
            
            // Track analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'fab_click', {
                    event_category: 'engagement',
                    event_label: item.text
                });
            }
        });

        return menuItem;
    }

    /**
     * Toggle FAB menu
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * Open FAB menu
     */
    open() {
        const fabMenu = document.querySelector('.fab-menu');
        const fabButton = document.querySelector('.fab-button');
        
        if (fabMenu && fabButton) {
            fabMenu.classList.add('active');
            fabButton.classList.add('active');
            this.isOpen = true;

            // Change icon
            const icon = fabButton.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-times';
            }
        }
    }

    /**
     * Close FAB menu
     */
    close() {
        const fabMenu = document.querySelector('.fab-menu');
        const fabButton = document.querySelector('.fab-button');
        
        if (fabMenu && fabButton) {
            fabMenu.classList.remove('active');
            fabButton.classList.remove('active');
            this.isOpen = false;

            // Restore icon
            const icon = fabButton.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-share-alt';
            }
        }
    }

    /**
     * Show/hide FAB based on scroll position
     */
    initScrollBehavior() {
        let lastScrollY = window.scrollY;
        const fabContainer = document.querySelector('.fab-container');

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (fabContainer) {
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    // Scrolling down - hide FAB
                    fabContainer.style.transform = 'translateY(100px)';
                } else {
                    // Scrolling up - show FAB
                    fabContainer.style.transform = 'translateY(0)';
                }
            }

            lastScrollY = currentScrollY;
        });
    }
}

// Initialize FAB Manager
const fabManager = new FABManager();

export default fabManager;