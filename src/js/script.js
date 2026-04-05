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
    if (typeof ScrollReveal !== 'function') {
        return;
    }

    const defaultOptions = {
        origin: 'bottom',
        distance: '30px', // Reduzido para um efeito mais "leve"
        duration: 1200,  // Aumentado para um efeito mais "lento"
        opacity: 0,
        reset: false,
        easing: 'cubic-bezier(0.5, 0, 0, 1)', // Curva de animação mais suave
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
        const isMobile = window.innerWidth <= 900;

        const servicosRevealOptions = {
            ...defaultOptions,
            origin: 'top', // Origem diferente para variar a animação
            interval: 150,
            delay: 200,
        };

        // No desktop, a animação é acionada pelo scroll da página (window).
        // No mobile, a animação é acionada pelo scroll do próprio container (carrossel).
        // Adicionar a opção 'container' apenas no mobile corrige o bug do desktop.
        if (isMobile) {
            servicosRevealOptions.container = servicosContainer;
        }

        ScrollReveal().reveal('.servicos-container .box-grid', servicosRevealOptions);
    }

    // Animações para a seção de Contato
    ScrollReveal().reveal('#contato .tags', { ...defaultOptions, origin: 'top', delay: 100 });
    // Animação para o layout de contato (colunas)
    ScrollReveal().reveal('.contact-info-left', { ...defaultOptions, origin: 'left', delay: 200, distance: '60px' });
    ScrollReveal().reveal('.contact-form-right', { ...defaultOptions, origin: 'right', delay: 200, distance: '60px' });
}

/**
 * Inicializa a lógica do carrossel de serviços para telas móveis com efeito infinito.
 */
function initServiceCarousel() {
    const container = document.querySelector('.servicos-container');
    const dotsContainer = document.querySelector('.servicos-dots');

    if (!container) return;

    const isMobile = window.innerWidth <= 900;

    // Se não for mobile, garante que o estado do carrossel seja limpo.
    if (!isMobile) {
        if (container.dataset.initialized) {
            if (dotsContainer) dotsContainer.innerHTML = '';
            // Remove clones se existirem
            container.querySelectorAll('[data-is-clone]').forEach(clone => clone.remove());
            delete container.dataset.initialized;
        }
        return;
    }

    // Se for mobile e já estiver inicializado, não faz nada.
    if (container.dataset.initialized) return;

    const realItems = Array.from(container.children);
    if (realItems.length <= 1) return;

    container.dataset.initialized = 'true';
    let isJumping = false; // Flag para controlar o salto do carrossel infinito

    // --- Lógica do Carrossel Infinito ---
    const firstClone = realItems[0].cloneNode(true);
    firstClone.dataset.isClone = 'true';
    const lastClone = realItems[realItems.length - 1].cloneNode(true);
    lastClone.dataset.isClone = 'true';

    container.appendChild(firstClone);
    container.insertBefore(lastClone, realItems[0]);

    const allItemsWithClones = Array.from(container.children);

    // Posiciona o carrossel no primeiro item real sem animação
    container.style.scrollBehavior = 'auto';
    container.scrollLeft = allItemsWithClones[1].offsetLeft;
    container.style.scrollBehavior = 'smooth';

    // --- Setup dos Pontos (Dots) ---
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        realItems.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Ir para o serviço ${index + 1}`);
            dot.addEventListener('click', () => {
                // O índice do item real é index + 1 no array com clones
                const targetItem = allItemsWithClones[index + 1];
                if (targetItem) {
                    isJumping = true;
                    targetItem.scrollIntoView({ behavior: 'smooth', inline: 'center' });
                    setTimeout(() => isJumping = false, 500); // Previne detecção de scroll durante o salto
                }
            });
            dotsContainer.appendChild(dot);
        });
    }
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

    const updateActiveDot = () => {
        if (dots.length === 0) return;

        const containerCenter = container.scrollLeft + (container.offsetWidth / 2);
        let minDistance = Infinity;
        let activeIndexInClones = -1;

        allItemsWithClones.forEach((item, index) => {
            const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
            const distance = Math.abs(containerCenter - itemCenter);
            if (distance < minDistance) {
                minDistance = distance;
                activeIndexInClones = index;
            }
        });

        let realIndex = (activeIndexInClones - 1 + realItems.length) % realItems.length;

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === realIndex);
        });
    };

    // --- Evento de Scroll ---
    let scrollEndTimer;
    container.addEventListener('scroll', () => {
        if (isJumping) return;

        updateActiveDot();

        clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(() => {
            const scrollLeft = container.scrollLeft;
            const firstItemOffset = allItemsWithClones[1].offsetLeft;
            const lastItemOffset = allItemsWithClones[allItemsWithClones.length - 2].offsetLeft;

            // Se chegou no clone do final (à direita)
            if (scrollLeft >= lastItemOffset + (realItems[0].offsetWidth / 2)) {
                isJumping = true;
                container.style.scrollBehavior = 'auto';
                container.scrollLeft = firstItemOffset;
                container.style.scrollBehavior = 'smooth';
                setTimeout(() => isJumping = false, 50);
            }

            // Se chegou no clone do início (à esquerda)
            if (scrollLeft <= firstItemOffset - (realItems[0].offsetWidth / 2)) {
                isJumping = true;
                container.style.scrollBehavior = 'auto';
                container.scrollLeft = lastItemOffset;
                container.style.scrollBehavior = 'smooth';
                setTimeout(() => isJumping = false, 50);
            }
        }, 150);
    }, { passive: true });

    // --- Inicialização ---
    updateActiveDot();
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

// --- Modal de Zoom para Imagens ---
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('modalZoom');
    const modalImg = document.getElementById('imgModalTarget');
    const closeBtn = document.querySelector('.modal-close');

    // 1. Escuta cliques em qualquer lugar da página
    document.addEventListener('click', function (e) {
        // Se o elemento clicado tiver o atributo data-zoom
        if (e.target.hasAttribute('data-zoom')) {
            modal.style.display = "flex"; // Abre o modal
            modalImg.src = e.target.src;  // Pega o caminho da imagem clicada
        }
    });

    // 2. Fechar ao clicar no 'X'
    closeBtn.onclick = function () {
        modal.style.display = "none";
    }

    // 3. Fechar ao clicar fora da imagem (no fundo escuro)
    modal.onclick = function (e) {
        if (e.target !== modalImg) {
            modal.style.display = "none";
        }
    }

    // 4. Fechar ao apertar a tecla ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === "Escape") {
            modal.style.display = "none";
        }
    });
});

/**
 * Inicializa modal de detalhes das skills a partir de um arquivo JSON.
 */
async function initSkillDetailsModal() {
    const skillBoxes = Array.from(document.querySelectorAll('.skills-container .skill-box[data-skill]'));
    if (!skillBoxes.length) return;

    const modal = document.getElementById('skillDetailsModal');
    const closeButton = document.getElementById('skillDetailsClose');
    const title = document.getElementById('skillDetailsTitle');
    const icon = document.getElementById('skillDetailsIcon');
    const description = document.getElementById('skillDetailsDescription');
    const usage = document.getElementById('skillDetailsUsage');
    const techTerms = document.getElementById('skillDetailsTechTerms');
    const simpleText = document.getElementById('skillDetailsSimple');
    const detailPanels = Array.from(document.querySelectorAll('.skill-detail-panel'));
    const areaBadge = document.getElementById('skillAreaBadge');
    const categoryBadge = document.getElementById('skillCategoryBadge');

    if (!modal || !closeButton || !title || !icon || !description || !usage || !techTerms || !simpleText || !areaBadge || !categoryBadge) return;

    let skillsById = {};
    let lastFocusedElement = null;
    let activeSkillBox = null;

    try {
        const response = await fetch('src/data/skills.json');
        if (!response.ok) {
            throw new Error(`Falha ao carregar skills.json: ${response.status}`);
        }

        const payload = await response.json();
        skillsById = payload.skills || {};
    } catch (error) {
        console.error('Não foi possível inicializar o modal de skills:', error);
        return;
    }

    const closeModal = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('skill-modal-open');

        if (activeSkillBox) {
            activeSkillBox.classList.remove('is-active');
            activeSkillBox = null;
        }

        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }

        lastFocusedElement = null;
    };

    const openModal = (skillBox) => {
        const skillId = skillBox.dataset.skill;
        const data = skillsById[skillId];
        if (!data) return;

        lastFocusedElement = skillBox;

        if (activeSkillBox && activeSkillBox !== skillBox) {
            activeSkillBox.classList.remove('is-active');
        }

        activeSkillBox = skillBox;
        activeSkillBox.classList.add('is-active');

        const skillBoxImage = skillBox.querySelector('img');
        const iconSrc = data.icon || (skillBoxImage ? skillBoxImage.getAttribute('src') : '');
        const iconAlt = `Ícone da tecnologia ${data.name || 'selecionada'}`;

        title.textContent = data.name || 'Tecnologia';
        icon.src = iconSrc || '';
        icon.alt = iconAlt;
        description.textContent = data.description || '';
        usage.textContent = data.usage || '';
        techTerms.textContent = data.techTerms || 'Não informado';
        simpleText.textContent = data.simpleExplanation || 'Não informado';
        areaBadge.textContent = `Área: ${data.area || 'Não definida'}`;
        categoryBadge.textContent = `Categoria: ${data.category || 'Não definida'}`;
        detailPanels.forEach((panel, index) => {
            panel.open = index === 0;
        });

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('skill-modal-open');
    };

    skillBoxes.forEach((skillBox) => {
        skillBox.addEventListener('click', () => openModal(skillBox));
        skillBox.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openModal(skillBox);
            }
        });
    });

    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
}

function initServiceDetailsModal() {
    const serviceCards = Array.from(document.querySelectorAll('.servicos-container .box-grid[data-service]'));
    if (!serviceCards.length) return;

    const modal = document.getElementById('serviceDetailsModal');
    const closeButton = document.getElementById('serviceDetailsClose');
    const title = document.getElementById('serviceDetailsTitle');
    const description = document.getElementById('serviceDetailsDescription');
    const includes = document.getElementById('serviceDetailsIncludes');
    const faq = document.getElementById('serviceDetailsFaq');

    if (!modal || !closeButton || !title || !description || !includes || !faq) return;

    const serviceContent = {
        website: {
            title: 'Criação de Sites',
            description: 'Desenvolvo páginas sob medida para apresentar sua marca, produto ou serviço com mais clareza, presença digital e foco no objetivo do projeto.',
            includes: [
                'Estrutura visual e conteúdo bem organizados',
                'Desenvolvimento front-end com atenção à performance',
                'Páginas institucionais, portfólios e landing pages'
            ],
            faq: 'Se você ainda não tiver o layout pronto, posso estruturar a interface e alinhar uma direção visual antes da implementação.'
        },
        responsive: {
            title: 'Sites Responsivos',
            description: 'Ajusto o projeto para funcionar bem em diferentes tamanhos de tela, deixando a navegação mais confortável e consistente no mobile e no desktop.',
            includes: [
                'Adaptação para celular, tablet e desktop',
                'Melhor hierarquia visual em telas menores',
                'Ajustes de espaçamento, tipografia e interação'
            ],
            faq: 'Isso pode ser feito tanto em projetos novos quanto em sites que já existem e precisam de melhorias.'
        },
        hosting: {
            title: 'Hospedagem',
            description: 'Posso ajudar na etapa de publicação para colocar o site no ar com mais segurança e menos atrito técnico.',
            includes: [
                'Orientação sobre deploy e publicação',
                'Ajustes básicos para ambiente de produção',
                'Suporte na organização do fluxo de entrega'
            ],
            faq: 'Se você ainda não souber onde publicar, posso indicar a opção mais adequada ao tipo de projeto.'
        },
        maintenance: {
            title: 'Manutencao de Sites & Suporte Tecnico',
            description: 'Atendo manutencao de sites e suporte tecnico para computadores, desktops e notebooks, com foco em correcao, ajuste e funcionamento.',
            includes: [
                'Correcoes e ajustes em sites',
                'Suporte para computadores, desktops e notebooks',
                'Atendimento pontual ou acompanhamento recorrente'
            ],
            faq: 'Esse suporte pode cobrir desde problemas em um site ate necessidades praticas em computadores de uso pessoal ou profissional.'
        },
        seo: {
            title: 'SEO & Performance',
            description: 'Organizo a página com boas práticas técnicas para melhorar carregamento, estrutura e experiência de navegação.',
            includes: [
                'Otimização básica de performance',
                'Melhor uso de semântica e estrutura da página',
                'Ajustes que ajudam visibilidade e experiência'
            ],
            faq: 'SEO aqui não é promessa de posição imediata, e sim uma base técnica melhor para o site crescer de forma saudável.'
        }
    };

    let lastFocusedElement = null;

    const closeModal = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('service-modal-open');

        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }

        lastFocusedElement = null;
    };

    const openModal = (card) => {
        const serviceId = card.dataset.service;
        const data = serviceContent[serviceId];
        if (!data) return;

        lastFocusedElement = card;
        title.textContent = data.title;
        description.textContent = data.description;
        faq.textContent = data.faq;
        includes.innerHTML = data.includes.map((item) => `<li>${item}</li>`).join('');

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('service-modal-open');
    };

    serviceCards.forEach((card) => {
        card.addEventListener('click', () => openModal(card));
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openModal(card);
            }
        });
    });

    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
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

function initProjectFilters() {
    const filterBar = document.querySelector('.project-filters');
    if (!filterBar) return;

    const buttons = Array.from(filterBar.querySelectorAll('button[data-filter]'));
    if (!buttons.length) return;

    const cards = Array.from(document.querySelectorAll('.project-grid .project-card[data-project-category]'));
    if (!cards.length) return;

    const grid = document.querySelector('.project-grid');
    const soonCard = document.querySelector('.project-grid .col-span-full');

    const normalizeCategory = (value) => (value || '')
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '');

    const getCardCategories = (card) => {
        const raw = (card.getAttribute('data-project-category') || '')
            .toString()
            .toLowerCase()
            .trim();

        if (!raw) return [];

        // Aceita: "landing ecommerce", "landing, ecommerce", "landing, ecommerce webapp" etc.
        return raw
            .split(/[,;|\/\s]+/g)
            .map((value) => normalizeCategory(value))
            .filter(Boolean);
    };

    const matchesFilter = (card, filter) => {
        if (!filter || filter === 'all') return true;
        return getCardCategories(card).includes(normalizeCategory(filter));
    };

    let activeFilter = buttons.find((button) => button.classList.contains('is-active'))?.dataset.filter || 'all';
    let rafHandle = null;

    const setActiveButton = (activeFilter) => {
        buttons.forEach((button) => {
            const isActive = button.dataset.filter === activeFilter;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    };

    const getRowTops = (elements) => {
        if (!grid || !elements.length) return [];

        // Força um reflow para garantir posições atualizadas
        void grid.offsetHeight;

        const gridRect = grid.getBoundingClientRect();
        const colCount = getGridColumnCount();

        // Calcula os tops e agrupa por linha
        const rowMap = new Map();
        elements.forEach((el, index) => {
            const top = Math.round(el.getBoundingClientRect().top - gridRect.top);
            if (Number.isFinite(top)) {
                if (!rowMap.has(top)) {
                    rowMap.set(top, []);
                }
                rowMap.get(top).push(index);
            }
        });

        return Array.from(rowMap.keys()).sort((a, b) => a - b);
    };

    const calculateCollapsedHeight = (visibleItems) => {
        if (!grid) return null;

        // Força um reflow para garantir posições atualizadas
        void grid.offsetHeight;

        const colCount = getGridColumnCount();
        const itemsPerRow = colCount;

        // Se há menos itens que uma linha, não aplica scroll
        if (visibleItems.length <= itemsPerRow) return null;

        // Calcula o índice do último item da segunda linha
        const lastItemSecondLine = Math.min(itemsPerRow * 2 - 1, visibleItems.length - 1);

        if (lastItemSecondLine < 0) return null;

        const lastVisibleElement = visibleItems[lastItemSecondLine];
        if (!lastVisibleElement) return null;

        // Força reflow novamente antes de medir
        void grid.offsetHeight;

        // Calcula a altura até o fim do último elemento visível
        const gridRect = grid.getBoundingClientRect();
        const elementRect = lastVisibleElement.getBoundingClientRect();
        const elementBottom = Math.round(elementRect.bottom - gridRect.top);

        // Adiciona um pequeno padding para garantir que o scroll seja visível
        return Math.max(elementBottom + 12, 0);
    };

    const setGridCollapsed = (collapsedHeight) => {
        if (!grid) return;
        if (collapsedHeight == null) {
            grid.classList.remove('projects-collapsed');
            grid.style.removeProperty('--projects-collapsed-max-height');
            return;
        }

        grid.classList.add('projects-collapsed');
        grid.style.setProperty('--projects-collapsed-max-height', `${collapsedHeight}px`);
    };

    const getGridColumnCount = () => {
        if (!grid) return 2;

        // Força um reflow para ter valores atualizados
        void grid.offsetHeight;

        const styles = window.getComputedStyle(grid);
        const template = styles.gridTemplateColumns || '';

        if (!template) return 2; // Default to 2 columns

        // Handle repeat(2, 1fr) and repeat(2, minmax(0, 1fr))
        if (template.includes('repeat(2')) {
            return 2;
        }

        // Se temos uma template válida, conta os espaços
        const cols = template.split(' ').filter(col => col !== '');
        if (cols.length > 0) {
            return cols.length;
        }

        // Fallback para 2 colunas
        return 2;
    };

    const positionSoonCard = (visibleCount) => {
        if (!soonCard) return;
        const colCount = getGridColumnCount();
        const remainder = visibleCount % colCount;

        if (colCount <= 1 || remainder === 0) {
            soonCard.style.gridColumn = '1 / -1';
            return;
        }

        const span = Math.max(colCount - remainder, 1);
        soonCard.style.gridColumn = `span ${span}`;
    };

    const animateVisibleCards = () => {
        const visibleCards = cards.filter((card) => !card.hidden);
        visibleCards.forEach((card) => {
            card.classList.remove('project-card--pop');
            // Force reflow to restart animation consistently
            void card.offsetWidth;
            card.classList.add('project-card--pop');
        });
    };

    const render = (scrollToTop = false) => {
        setActiveButton(activeFilter);

        cards.forEach((card) => {
            card.hidden = !matchesFilter(card, activeFilter);
        });

        const matchingCards = cards.filter((card) => !card.hidden);
        positionSoonCard(matchingCards.length);

        if (grid && scrollToTop) {
            grid.scrollTop = 0;
        }

        if (rafHandle) {
            cancelAnimationFrame(rafHandle);
        }

        rafHandle = requestAnimationFrame(() => {
            rafHandle = null;

            if (!grid) return;

            // Reseta o scroll para o topo para cálculos precisos
            const previousScrollTop = grid.scrollTop;
            grid.scrollTop = 0;

            // Aguarda um pouco para que o layout se estabilize
            setTimeout(() => {
                const visibleItems = [...matchingCards];
                if (soonCard && !soonCard.hidden) {
                    visibleItems.push(soonCard);
                }

                // Calcula a altura do collapsed
                const collapsedHeight = calculateCollapsedHeight(visibleItems);

                // Restaura a posição anterior apenas se não está scrollToTop
                if (!scrollToTop && collapsedHeight != null) {
                    // Não restaura para deixar a transição limpa
                    grid.scrollTop = 0;
                }

                setGridCollapsed(collapsedHeight);
                animateVisibleCards();
            }, 0);
        });
    };

    buttons.forEach((button) => {
        button.setAttribute('aria-pressed', button.classList.contains('is-active') ? 'true' : 'false');
        button.addEventListener('click', () => {
            activeFilter = button.dataset.filter || 'all';
            render(true);
        });
    });

    window.addEventListener('resize', () => render());

    render();
}

/**
 * Lida com o envio do formulário de contato usando AJAX para exibir mensagens de sucesso/erro.
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');

    if (!form || !statusDiv) {
        console.error("O formulário de contato ou a div de status não foram encontrados.");
        return;
    }

    const allInputs = Array.from(form.querySelectorAll('input, textarea, select'));

    async function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);

        // Exibe uma mensagem de "Enviando..."
        statusDiv.textContent = "Enviando...";
        statusDiv.className = "sending"; // You can style this class if you want
        statusDiv.style.display = "block";

        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                statusDiv.textContent = "Opaa... Mensagem enviada com sucesso! Muito obrigado por enviar seu contato! Em breve retornarei. 🚀";
                statusDiv.className = "success";
                form.reset();
                allInputs.forEach((input) => input.classList.remove('has-content'));
            } else {
                const responseData = await response.json();
                if (Object.hasOwn(responseData, 'errors')) {
                    const errorMessages = responseData.errors.map(error => error.message).join(", ");
                    statusDiv.textContent = `Erro: ${errorMessages}`;
                } else {
                    statusDiv.textContent = "Oops! Ocorreu um problema ao enviar seu formulário.";
                }
                statusDiv.className = "error";
            }
        } catch (error) {
            statusDiv.textContent = "Oops! Ocorreu um problema de conexão.";
            statusDiv.className = "error";
            console.error("Erro de rede ou CORS ao enviar para o Formspree:", error);
        } finally {
            // Esconde a mensagem de status após alguns segundos
            setTimeout(() => {
                statusDiv.style.display = "none";
            }, 6000);
        }
    }

    form.addEventListener("submit", handleSubmit);

    // --- Lógica para Labels Flutuantes e Placeholders --- 
    allInputs.forEach(input => {
        // Garante que o estado inicial esteja correto no caso de autocompletar do navegador
        if (input.value) {
            input.classList.add('has-content');
        }

        input.addEventListener('focus', () => {
            input.classList.add('has-content'); // Adiciona a classe para o label subir
        });

        input.addEventListener('blur', () => {
            if (input.value === '') {
                input.classList.remove('has-content'); // Remove a classe se o campo estiver vazio
            }
        });

        // Adiciona um listener para o caso de o autocompletar preencher o campo sem foco
        input.addEventListener('input', () => {
            if (input.value) {
                input.classList.add('has-content');
            } else {
                input.classList.remove('has-content');
            }
        });

        input.addEventListener('change', () => {
            if (input.value) {
                input.classList.add('has-content');
            } else {
                input.classList.remove('has-content');
            }
        });
    });

    document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
        input.addEventListener('focus', function () {
            if (!this.value) {
                this.setAttribute('placeholder', this.dataset.placeholder || '');
            }
        });
        input.addEventListener('blur', function () {
            this.setAttribute('placeholder', '');
        });
    });
}

/**
 * Inicializa o botão de alternância de tema (claro/escuro).
 */
function initThemeToggle() {
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    const body = document.body;

    if (themeToggleBtns.length === 0) return;

    // Função para aplicar o tema e salvar a preferência
    const applyTheme = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-theme');
        } else {
            body.classList.remove('light-theme');
        }
        localStorage.setItem('theme', theme);
    };

    // Função para alternar o tema
    const toggleTheme = () => {
        const currentTheme = body.classList.contains('light-theme') ? 'dark' : 'light';
        applyTheme(currentTheme);
    };

    // Adiciona o evento de clique a todos os botões de tema
    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });

    // No carregamento inicial, verifica o tema salvo ou a preferência do sistema
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Define o tema escuro como padrão se nenhuma preferência for encontrada
        applyTheme('dark');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        initScrollReveal();
    } catch (error) {
        console.warn('ScrollReveal indisponivel:', error);
    }

    initMobileNav();
    initSmoothScroll();
    initProjectFilters();
    initServiceDetailsModal();
    initSkillDetailsModal();
    initContactForm();
    initThemeToggle();
    addEventListeners();

    if (typeof updateGithubStats === 'function') {
        updateGithubStats();
    }
});

(function () {
    // Função para tentar abrir o composer do Gmail; se bloquear, usa mailto: como fallback
    function openGmailComposer(email) {
        if (!email) return;
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
        // Tenta abrir em nova aba/janela
        const newWin = window.open(gmailUrl, '_blank');
        // Se window.open falhar (popup bloqueado) ou retorna null, usa mailto:
        if (!newWin) {
            window.location.href = `mailto:${email}`;
            return;
        }
        // Em alguns navegadores window.open pode retornar um objeto, mas ser bloqueado.
        // Verificar se foi realmente criado depois de um curto delay.
        setTimeout(() => {
            try {
                if (!newWin || newWin.closed) {
                    window.location.href = `mailto:${email}`;
                }
            } catch (err) {
                // Se houver erro de cross-origin, considerar que abriu com sucesso e não fazer fallback.
            }
        }, 500);
    }

    // Adiciona event listeners a todos os elementos com classe .gmail (ancoras ou botões/FAB)
    function attachGmailFallback() {
        const elems = Array.from(document.querySelectorAll('.gmail'));
        elems.forEach(el => {
            // tenta extrair email de diferentes fontes: href (mailto:), data-email, data-href (mailto:)
            let email = null;

            if (el.tagName.toLowerCase() === 'a') {
                const href = el.getAttribute('href') || '';
                const mailtoMatch = href.match(/^mailto:([^?]+)/i);
                email = mailtoMatch ? mailtoMatch[1] : null;
            }

            if (!email) {
                email = el.dataset.email || null;
                if (!email && el.dataset.href) {
                    const m = el.dataset.href.match(/^mailto:([^?]+)/i);
                    email = m ? m[1] : null;
                }
            }

            el.addEventListener('click', function (e) {
                if (!email) {
                    // sem email configurado, deixa comportamento padrão
                    return;
                }

                const isMobile = /Mobi|Android/i.test(navigator.userAgent);

                // Se for âncora e mobile, deixar comportamento padrão para abrir apps nativos
                if (isMobile && el.tagName.toLowerCase() === 'a') {
                    return;
                }

                // Para botões em mobile, redireciona para mailto: para abrir app nativo
                if (isMobile && el.tagName.toLowerCase() !== 'a') {
                    e.preventDefault();
                    window.location.href = `mailto:${email}`;
                    return;
                }

                // Desktop: intercepta e tenta abrir composer do Gmail com fallback
                e.preventDefault();
                openGmailComposer(email);
            });
        });
    }

    // Inicializa ao DOM pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachGmailFallback);
    } else {
        attachGmailFallback();
    }
})();



