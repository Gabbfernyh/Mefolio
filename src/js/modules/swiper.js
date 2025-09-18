/**
 * Swiper Configuration Module
 * Handles all carousel/swiper functionality
 */

class SwiperManager {
    constructor() {
        this.swipers = new Map();
        this.init();
    }

    init() {
        // Wait for Swiper library to load
        this.waitForSwiper(() => {
            // Initialize immediately if DOM is already loaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.initServicesSwiper();
                });
            } else {
                // DOM is already loaded
                this.initServicesSwiper();
            }
        });

        // Handle resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    /**
     * Wait for Swiper library to be available
     */
    waitForSwiper(callback) {
        if (typeof Swiper !== 'undefined') {
            callback();
            return;
        }

        // Poll for Swiper availability
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max
        
        const checkSwiper = () => {
            attempts++;
            if (typeof Swiper !== 'undefined') {
                callback();
            } else if (attempts < maxAttempts) {
                setTimeout(checkSwiper, 100);
            }
        };

        setTimeout(checkSwiper, 100);
    }

    /**
     * Initialize services swiper for mobile
     */
    initServicesSwiper() {
        if (!this.isMobile()) {
            return;
        }

        const swiperElement = document.querySelector('.mobile-swiper');
        
        if (!swiperElement) {
            return;
        }

        // Check if Swiper library is loaded
        if (typeof Swiper === 'undefined') {
            return;
        }
        
        const swiper = new Swiper('.mobile-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            centeredSlides: true,
            loop: true, // Ativando loop para autoplay funcionar melhor
            // Autoplay configuration
            autoplay: {
                delay: 3000, // 3 segundos entre slides
                disableOnInteraction: false, // Continua depois de interação do usuário
                pauseOnMouseEnter: true, // Pausa quando mouse entra (se aplicável)
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            // Navigation arrows (optional - você pode adicionar depois)
            /*
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            */
            breakpoints: {
                480: {
                    slidesPerView: 1.2,
                    spaceBetween: 30,
                    centeredSlides: true
                },
                640: {
                    slidesPerView: 1.5,
                    spaceBetween: 30,
                    centeredSlides: true
                }
            },
            // Accessibility
            a11y: {
                prevSlideMessage: 'Slide anterior',
                nextSlideMessage: 'Próximo slide',
                paginationBulletMessage: 'Ir para slide {{index}}'
            },
            // Add event callbacks
            on: {
                slideChange: function() {
                    // Callback para mudança de slide
                },
            }
        });

        this.swipers.set('services', swiper);
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const isMobileNow = this.isMobile();
        const servicesSwiper = this.swipers.get('services');

        if (isMobileNow && !servicesSwiper) {
            this.initServicesSwiper();
        } else if (!isMobileNow && servicesSwiper) {
            servicesSwiper.destroy(true, true);
            this.swipers.delete('services');
        }
    }

    /**
     * Check if current viewport is mobile
     */
    isMobile() {
        return window.innerWidth < 768;
    }

    /**
     * Destroy all swipers
     */
    destroyAll() {
        this.swipers.forEach((swiper) => {
            swiper.destroy(true, true);
        });
        this.swipers.clear();
    }
}

// Initialize Swiper Manager
const swiperManager = new SwiperManager();

export default swiperManager;