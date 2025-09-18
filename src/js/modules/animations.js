/**
 * Animation Manager Module
 * Handles typing effects and scroll animations
 */

class AnimationManager {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initTypingEffect();
            this.initScrollReveal();
        });
    }

    /**
     * Initialize typing effect for hero section
     */
    initTypingEffect() {
        const elements = document.querySelectorAll('.typing-effect');
        
        elements.forEach((element, index) => {
            const text = element.getAttribute('data-text');
            if (text) {
                setTimeout(() => {
                    this.typeWriter(element, text, 75, () => {
                        // Callback after typing is complete
                        element.classList.remove('typing');
                        
                        // Start next element if exists
                        const nextElement = elements[index + 1];
                        if (nextElement) {
                            nextElement.style.opacity = '1';
                        }
                    });
                }, index * 2000); // Delay between elements
            }
        });

        // Show hero text after a delay
        setTimeout(() => {
            const heroTextSup = document.querySelector('.hero-text-sup');
            if (heroTextSup) {
                heroTextSup.style.opacity = '1';
            }
        }, 500);
    }

    /**
     * Type writer effect
     * @param {HTMLElement} element - Target element
     * @param {string} text - Text to type
     * @param {number} speed - Typing speed in ms
     * @param {Function} callback - Callback function
     */
    typeWriter(element, text, speed = 75, callback) {
        let i = 0;
        element.innerHTML = '';
        element.classList.add('typing');

        const type = () => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.classList.remove('typing');
                if (callback) callback();
            }
        };

        type();
    }

    /**
     * Initialize ScrollReveal animations
     */
    initScrollReveal() {
        // Only proceed if ScrollReveal is available
        if (typeof ScrollReveal === 'undefined') {
            return;
        }

        const sr = ScrollReveal({
            origin: 'bottom',
            distance: '60px',
            duration: 1000,
            delay: 200,
            reset: false
        });

        // Animate elements with specific classes
        sr.reveal('.efeito-about-text', { delay: 300 });
        sr.reveal('.efeito-about-icons', { delay: 500 });
        sr.reveal('.efeito-prejects', { delay: 300 });
        sr.reveal('.project-card', { 
            delay: 200,
            interval: 100
        });
        sr.reveal('.skill-box', {
            delay: 100,
            interval: 50
        });
        sr.reveal('.box-grid:not(.mobile-swiper .box-grid)', {
            delay: 100,
            interval: 100
        });
        
        // Garantir que box-grids do mobile swiper sejam sempre visíveis
        const mobileBoxGrids = document.querySelectorAll('.mobile-swiper .box-grid');
        mobileBoxGrids.forEach(grid => {
            grid.style.opacity = '1';
            grid.style.visibility = 'visible';
            grid.style.transform = 'none';
        });
    }

    /**
     * Add smooth scroll behavior to navigation links
     */
    initSmoothScroll() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Animate number counting
     * @param {HTMLElement} element - Target element
     * @param {number} target - Target number
     * @param {number} duration - Animation duration in ms
     */
    animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            element.textContent = Math.floor(start);
            
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }

    /**
     * Add loading animation to images
     */
    initImageLoading() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        });
    }
}

// Initialize Animation Manager
const animationManager = new AnimationManager();

export default animationManager;