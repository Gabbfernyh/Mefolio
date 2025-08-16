// --- Função para efeito de digitação ---
function typeWriter(element, text, speed = 75, callback) {
    let i = 0;
    element.innerHTML = ''; // Limpa o texto existente
    element.classList.add('typing'); // Adiciona a classe para mostrar o cursor

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            element.classList.remove('typing'); // Remove o cursor quando terminar
            if (callback) {
                callback();
            }
        }
    }
    type();
}

/**
 * Configura as animações de revelação de elementos ao rolar a página.
 */
function initScrollReveal() {
    const defaultOptions = {
        origin: 'bottom',
        distance: '40px',
        duration: 1000,
        opacity: 0,
        reset: false,
    };

    // Animação para o conteúdo do Hero (texto, botões)
    const heroText = document.querySelector('.hero-text-container');
    const heroCTA = document.querySelector('.curriculo-download');
    const heroSocials = document.querySelector('.hero-socials.desktop-only');
    const heroImage = document.querySelector('.avatar-img');


    // 1. Anima o container do texto e dispara o efeito de digitação
    if (heroText) {
        ScrollReveal().reveal(heroText, {
            origin: 'left',
            distance: '50px',
            duration: 1200,
            delay: 200,
            easing: 'ease',
            opacity: 0,
            reset: false,
            afterReveal: function (el) {
                const pSup = el.querySelector('p.hero-text-sup');
                const h1 = el.querySelector('h1.typing-effect');
                const pSub = el.querySelector('p.hero-text-sub.typing-effect');

                if (pSup && h1 && pSub) {
                    const h1Text = h1.dataset.text || '';
                    const pSubText = pSub.dataset.text || '';

                    pSup.style.opacity = 1;
                    typeWriter(h1, h1Text, 75, () => {
                        typeWriter(pSub, pSubText, 50);
                    });
                }
            }
        });
    }

    // 2. Anima o botão de currículo para aparecer de baixo, sem se mover com o texto
    if (heroCTA) {
        ScrollReveal().reveal(heroCTA, { ...defaultOptions, distance: '0px', delay: 800 });
    }

    // 3. Anima os ícones sociais
    if (heroSocials) {
        ScrollReveal().reveal(heroSocials, { ...defaultOptions, distance: '0px', delay: 900 });
    }

    // 4. Anima a imagem do avatar
    if (heroImage) {
        ScrollReveal().reveal(heroImage, { ...defaultOptions, origin: 'right', distance: '50px', duration: 1200, delay: 300 });
    }

    ScrollReveal().reveal('.efeito-about-text', { ...defaultOptions, duration: 1200, delay: 100 });
    ScrollReveal().reveal('.efeito-about-icons .contact-item', { ...defaultOptions, interval: 120 });
    ScrollReveal().reveal('.efeito-prejects .project-card', { ...defaultOptions, distance: '50px', duration: 1200, interval: 120 });
    ScrollReveal().reveal('.skills-container .skill-box', { ...defaultOptions, interval: 100 });

    // Animação para o carrossel de serviços
    const servicosContainer = document.querySelector('.servicos-container');
    if (servicosContainer) {
        // Animação para os cards de serviço. Funciona tanto no desktop (scroll da página)
        // quanto no mobile (aparecem quando a seção entra na tela).
        ScrollReveal().reveal('.servicos-container .box-grid', {
            ...defaultOptions,
            interval: 120,
            delay: 200,
            container: servicosContainer
        });
    }

    // Animações para a seção de Contato
    ScrollReveal().reveal('#contato .tags', { ...defaultOptions, origin: 'top', delay: 100 });
    // Animação para o layout de contato (colunas)
    ScrollReveal().reveal('.contact-info-left', { ...defaultOptions, origin: 'left', delay: 200, distance: '60px' });
    ScrollReveal().reveal('.contact-form-right', { ...defaultOptions, origin: 'right', delay: 200, distance: '60px' });
}

/**
 * Inicializa a lógica do carrossel de serviços para telas móveis.
 */
function initServiceCarousel() {
    const servicosContainer = document.querySelector('.servicos-container');
    const servicosItems = document.querySelectorAll('.servicos-container .box-grid');
    const dotsContainer = document.querySelector('.servicos-dots');

    if (!servicosContainer || !dotsContainer || window.innerWidth > 900) return;

    servicosItems.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Ir para o serviço ${index + 1}`);
        if (index === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const itemIndex = Array.from(servicosItems).indexOf(entry.target);
                dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === itemIndex));
            }
        });
    }, { root: servicosContainer, threshold: 0.6 });

    servicosItems.forEach(item => observer.observe(item));

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            servicosItems[index].scrollIntoView({ behavior: 'smooth', inline: 'start' });
        });
    });

    servicosContainer.addEventListener('scroll', () => {
        const { scrollLeft, clientWidth, scrollWidth } = servicosContainer;
        // Check if scrolled to the end (with a small tolerance)
        if (scrollLeft + clientWidth >= scrollWidth - 1) {
            // Use a timeout to allow the scroll snap to finish
            setTimeout(() => {
                servicosContainer.scrollTo({ left: 0, behavior: 'smooth' });
            }, 500); // Adjust timeout as needed
        }
    });
}

/**
 * Inicializa o botão de ação flutuante (FAB) para mobile.
 */
function initFab() {
    const fabButton = document.querySelector('.fab-button');
    const fabLinks = document.querySelector('.fab-links');

    if (fabButton && fabLinks) {
        fabButton.addEventListener('click', (event) => {
            event.stopPropagation();
            fabLinks.classList.toggle('show');
        });

        document.addEventListener('click', (event) => {
            if (!fabLinks.contains(event.target) && !fabButton.contains(event.target)) {
                fabLinks.classList.remove('show');
            }
        });
    }
}

/**
 * Configura a navegação do menu mobile (hambúrguer e sidebar).
 */
function initMobileNav() {
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const sidebarMenu = document.querySelector('.sidebar-menu');
    const closeSidebar = document.querySelector('.close-sidebar');
    const sidebarNavLinks = document.querySelectorAll('.sidebar-nav-links .nav-link');

    if (!hamburgerIcon || !sidebarMenu || !closeSidebar) return;

    const toggleSidebar = (open) => {
        sidebarMenu.classList.toggle('open', open);
        hamburgerIcon.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
        if (open) {
            history.pushState({ sidebarOpen: true }, 'sidebar');
        }
    };

    hamburgerIcon.addEventListener('click', () => toggleSidebar(true));
    closeSidebar.addEventListener('click', () => toggleSidebar(false));

    document.addEventListener('click', (event) => {
        if (sidebarMenu.classList.contains('open') && !sidebarMenu.contains(event.target) && !hamburgerIcon.contains(event.target)) {
            toggleSidebar(false);
        }
    });

    sidebarNavLinks.forEach(link => {
        link.addEventListener('click', () => toggleSidebar(false));
    });

    window.addEventListener('popstate', () => {
        if (sidebarMenu.classList.contains('open')) {
            toggleSidebar(false);
        }
    });
}

/**
 * Configura o scroll suave com deslocamento para o header fixo.
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('.nav-link, .sidebar-nav-links .nav-link');
    if (!links.length) return;

    links.forEach(link => {
        link.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            if (href && href.startsWith('#')) {
                e.preventDefault();

                const target = document.querySelector(href);
                if (target) {
                    const mobileHeader = document.querySelector('.mobile-header');
                    let headerHeight = 0;

                    // Apenas calcula o deslocamento se o cabeçalho móvel (que é fixo) estiver visível.
                    if (mobileHeader && window.getComputedStyle(mobileHeader).display !== 'none') {
                        headerHeight = mobileHeader.offsetHeight;
                    }

                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - headerHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    });
}

/**
 * Adiciona os event listeners para elementos interativos, como os alertas.
 */
function addEventListeners() {
    document.querySelectorAll('.js-linkedin-alert').forEach(link => {
        link.addEventListener('click', linkedinAlert);
    });

    const curriculoBtn = document.querySelector('.js-curriculo-alert');
    if (curriculoBtn) {
        curriculoBtn.addEventListener('click', curriculoAlert);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initServiceCarousel();
    initFab();
    initMobileNav();
    initSmoothScroll();
    addEventListeners();
});