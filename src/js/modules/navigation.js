/**
 * Navigation Manager Module
 * Handles mobile menu and navigation interactions
 */

class NavigationManager {
    constructor() {
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.bindEvents();
            this.initSmoothScroll();
        });
    }

    /**
     * Bind navigation events
     */
    bindEvents() {
        const hamburger = document.querySelector('.hamburger-icon');
        const sidebar = document.querySelector('.sidebar-menu');
        const closeSidebar = document.querySelector('.close-sidebar');
        const sidebarLinks = document.querySelectorAll('.sidebar-nav-links a');

        // Toggle mobile menu
        if (hamburger) {
            hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Close mobile menu
        if (closeSidebar) {
            closeSidebar.addEventListener('click', () => this.closeMobileMenu());
        }

        // Close menu when clicking on links
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && sidebar && !sidebar.contains(e.target) && !hamburger.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    /**
     * Open mobile menu
     */
    openMobileMenu() {
        const sidebar = document.querySelector('.sidebar-menu');
        const hamburger = document.querySelector('.hamburger-icon');
        
        if (sidebar) {
            sidebar.classList.add('active');
            this.isMenuOpen = true;
            
            // Animate hamburger
            if (hamburger) {
                hamburger.classList.add('active');
            }

            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        const sidebar = document.querySelector('.sidebar-menu');
        const hamburger = document.querySelector('.hamburger-icon');
        
        if (sidebar) {
            sidebar.classList.remove('active');
            this.isMenuOpen = false;
            
            // Reset hamburger
            if (hamburger) {
                hamburger.classList.remove('active');
            }

            // Restore body scroll
            document.body.style.overflow = '';
        }
    }

    /**
     * Initialize smooth scrolling for navigation links
     */
    initSmoothScroll() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Highlight active navigation item based on scroll position
     */
    initActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeId = entry.target.id;
                    
                    // Remove active class from all links
                    navLinks.forEach(link => link.classList.remove('active'));
                    
                    // Add active class to current section link
                    const activeLink = document.querySelector(`.nav-link[href="#${activeId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-20% 0px -70% 0px'
        });

        sections.forEach(section => observer.observe(section));
    }
}

// Initialize Navigation Manager
const navigationManager = new NavigationManager();

export default navigationManager;