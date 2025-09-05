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
 * Inicializa a lógica do carrossel de serviços para telas móveis.
 */
function initServiceCarousel() {
    const container = document.querySelector('.servicos-container');
    const dotsContainer = document.querySelector('.servicos-dots');

    // --- Guard Clauses ---
    if (!container || !dotsContainer) return;

    // Lógica de Desktop: limpa o estado do carrossel se existir
    if (window.innerWidth > 900) {
        if (container.dataset.initialized) {
            dotsContainer.innerHTML = '';
            // Remove a classe 'card-active' de todos os itens
            container.querySelectorAll('.box-grid').forEach(item => item.classList.remove('card-active'));
            delete container.dataset.initialized;
        }
        return;
    }

    // Lógica Mobile: inicializa o carrossel
    if (container.dataset.initialized) return; // Já inicializado para mobile

    const allItems = Array.from(container.children);
    if (allItems.length <= 1) return;

    container.dataset.initialized = 'true';
    let currentIndex = 0; // Começa no primeiro item (índice 0)

    // --- Setup dos Pontos (Dots) ---
    dotsContainer.innerHTML = '';
    allItems.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Ir para o serviço ${index + 1}`);
        dot.dataset.targetIndex = index; // O índice do dot corresponde ao índice do item
        dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll('.dot');

    // --- Funções Principais ---
    const updateActiveState = () => {
        // Atualiza o ponto ativo
        dots.forEach((dot, index) => dot.classList.toggle('active', index === currentIndex));
        // Atualiza o card ativo
        allItems.forEach((item, index) => item.classList.toggle('card-active', index === currentIndex));
    };

    // --- Event Listeners ---
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const targetIndex = parseInt(e.target.dataset.targetIndex, 10);
            const targetItem = allItems[targetIndex];
            // Usa scrollIntoView para um efeito suave.
            if (targetItem) {
                targetItem.scrollIntoView({ behavior: 'smooth', inline: 'center' });
            }
        });
    });

    // Atualiza o estado do card ativo após a rolagem
    let scrollEndTimer;
    container.addEventListener('scroll', () => {
        // Usa um temporizador para detectar o fim da rolagem.
        // Isso é crucial para que a lógica de "item ativo" seja executada apenas
        // quando o scroll-snap do navegador terminar de ajustar a posição, evitando que itens sejam "pulados".
        clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(() => {
            const containerCenter = container.scrollLeft + (container.offsetWidth / 2);
            let minDistance = Infinity;
            let newActiveIndex = -1;

            allItems.forEach((item, index) => {
                const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
                const distance = Math.abs(containerCenter - itemCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    newActiveIndex = index;
                }
            });

            // Atualiza o estado apenas se o índice realmente mudou
            if (newActiveIndex !== -1 && currentIndex !== newActiveIndex) {
                currentIndex = newActiveIndex;
                updateActiveState();
            }
        }, 100); // Um timeout curto é suficiente para detectar o fim do scroll.
    });

    // --- Inicialização ---
    // Define o primeiro item como ativo ao carregar.
    updateActiveState();
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

/**
 * Lida com o envio do formulário de contato usando AJAX para exibir mensagens de sucesso/erro.
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    const allInputs = [nameInput, emailInput, phoneInput, messageInput];

    if (!form || !statusDiv || !allInputs.every(Boolean)) {
        console.error("Um ou mais elementos do formulário de contato não foram encontrados.");
        return;
    }

    // Adiciona um listener para o campo de telefone para permitir apenas números
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            // Remove tudo que não for dígito, mantendo o valor atualizado no campo
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
    // Função para validar os campos do formulário
    const validateForm = () => {
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Reseta os erros anteriores
        [nameInput, emailInput, messageInput].forEach(input => input.classList.remove('invalid-field'));

        // Validação do Nome
        if (nameInput.value.trim() === '') {
            isValid = false;
            nameInput.classList.add('invalid-field');
        }

        // Validação do E-mail
        if (emailInput.value.trim() === '' || !emailRegex.test(emailInput.value.trim())) {
            isValid = false;
            emailInput.classList.add('invalid-field');
        }

        // Validação da Mensagem
        if (messageInput.value.trim() === '') {
            isValid = false;
            messageInput.classList.add('invalid-field');
        }

        return isValid;
    };

    async function handleSubmit(event) {
        event.preventDefault();

        // Executa a validação antes de enviar
        if (!validateForm()) {
            statusDiv.textContent = "Por favor, corrija os campos destacados.";
            statusDiv.className = "error";
            statusDiv.style.display = "block";
            setTimeout(() => { statusDiv.style.display = "none"; }, 5000);
            return; // Impede o envio do formulário
        }

        const data = new FormData(event.target);

        // Exibe uma mensagem de "Enviando..."
        statusDiv.textContent = "Enviando...";
        statusDiv.className = "sending";
        statusDiv.style.display = "block";

        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: { Accept: "application/json" },
            });

            if (response.ok) {
                statusDiv.textContent = "Mensagem enviada com sucesso! Obrigado.";
                statusDiv.className = "success";
                form.reset();
                // Limpa os placeholders para os labels voltarem ao estado inicial
                allInputs.forEach((input) => { input.placeholder = ""; });
                setTimeout(() => { statusDiv.style.display = "none"; }, 8000);
            } else {
                // LOG ADICIONADO PARA DEBUG
                console.error("Formspree respondeu com um erro.", {
                    status: response.status,
                    statusText: response.statusText,
                });
                let errorMsg = "Ocorreu um erro ao enviar. Tente novamente.";
                try {
                    const responseData = await response.json();
                    // LOG ADICIONADO PARA DEBUG
                    console.error("Dados do erro do Formspree:", responseData);
                    if (responseData && responseData.errors) {
                        errorMsg = responseData.errors.map(error => error.message).join(", ");
                    }
                } catch (jsonError) {
                    console.error("Não foi possível analisar a resposta do servidor como JSON.", jsonError);
                }
                statusDiv.textContent = errorMsg;
                statusDiv.className = "error";
                setTimeout(() => { statusDiv.style.display = "none"; }, 8000);
            }
        } catch (error) {
            // LOG ADICIONADO PARA DEBUG
            console.error("Falha na requisição fetch para o Formspree. Isso pode ser um problema de rede ou CORS.", error);
            statusDiv.textContent = "Erro de conexão. Verifique sua internet e tente novamente.";
            statusDiv.className = "error";
            setTimeout(() => { statusDiv.style.display = "none"; }, 8000);
        }
    }

    form.addEventListener("submit", handleSubmit);

    // Lógica para labels flutuantes, placeholders dinâmicos e feedback de validação
    allInputs.forEach(input => {
        // Mostra o placeholder de exemplo quando o campo ganha foco
        input.addEventListener('focus', () => {
            input.placeholder = input.dataset.placeholder || '';
        });

        // Esconde o placeholder se o campo estiver vazio ao perder o foco,
        // permitindo que o label retorne à posição inicial.
        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                input.placeholder = '';
            }
        });

        // Remove a classe de erro enquanto o usuário digita
        input.addEventListener('input', () => {
            input.classList.remove('invalid-field');
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
    initScrollReveal();
    initServicosCarouselMobile(); // Só esta função para o carrossel!
    initFab();
    initMobileNav();
    initSmoothScroll();
    initContactForm();
    initThemeToggle();
    addEventListeners();
});

/**
 * Inicializa o carrossel de serviços para telas móveis.
 */
function initServicosCarouselMobile() {
    if (window.innerWidth > 900) return; // Só no mobile

    const container = document.querySelector('.servicos-container');
    const cards = Array.from(container.querySelectorAll('.box-grid'));
    let current = 0;
    let interval;

    function updateCarousel() {
        cards.forEach((card, idx) => {
            card.classList.toggle('active', idx === current);
        });
    }

    function nextCard() {
        current = (current + 1) % cards.length;
        updateCarousel();
    }

    function restartInterval() {
        clearInterval(interval);
        interval = setInterval(nextCard, 3500);
    }

    updateCarousel();
    interval = setInterval(nextCard, 3500);

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            clearInterval(interval);
            cards.forEach(card => card.classList.add('active'));
        } else {
            updateCarousel();
            restartInterval();
        }
    });
}