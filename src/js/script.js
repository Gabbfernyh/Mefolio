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

document.addEventListener('DOMContentLoaded', function () {
    // --- ScrollReveal animações ---
    ScrollReveal().reveal('.efeito-hero-content', {
        origin: 'top',
        distance: '40px',
        duration: 900,
        delay: 100,
        easing: 'ease',
        opacity: 0,
        reset: false
    });

    // Animação especial para o texto do "hero" com efeito de digitação
    const heroTextContainer = document.querySelector('.efeito-hero-content-textimg');
    if (heroTextContainer) {
        ScrollReveal().reveal(heroTextContainer, {
            origin: 'left',
            distance: '40px',
            duration: 900,
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

                    // 1. Mostra o "Olá, eu sou"
                    pSup.style.opacity = 1;

                    // 2. Inicia a digitação do H1 e, em seguida, do P
                    typeWriter(h1, h1Text, 75, () => {
                        typeWriter(pSub, pSubText, 50);
                    });
                }
            }
        });
    }
    ScrollReveal().reveal('.efeito-about-text', {
        origin: 'bottom',
        distance: '30px',
        duration: 900,
        delay: 100,
        opacity: 0,
        reset: false
    });

    ScrollReveal().reveal('.efeito-about-icons .contact-item', {
        origin: 'bottom',
        distance: '30px',
        duration: 800,
        interval: 120,
        opacity: 0,
        reset: false
    });

    ScrollReveal().reveal('.efeito-prejects .project-card', {
        origin: 'bottom',
        distance: '40px',
        duration: 900,
        interval: 120,
        opacity: 0,
        reset: false
    });

    ScrollReveal().reveal('.skills-container .skill-box', {
        origin: 'bottom',
        distance: '30px',
        duration: 800,
        interval: 100,
        opacity: 0,
        reset: false
    });

    // Animação para o carrossel de serviços, monitorando o scroll do próprio container
    const servicosContainer = document.querySelector('.servicos-container');
    if (servicosContainer) {
        ScrollReveal().reveal('.servicos-container .box-grid', {
            origin: 'bottom',
            distance: '30px',
            duration: 800,
            interval: 120,
            opacity: 0,
            reset: false,
            container: servicosContainer
        });
    }

    // --- Lógica para fechar o menu mobile ao clicar em um link ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelectorAll('.nav-links-mobile .nav-link');

    if (menuToggle && navLinks.length > 0) {
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                if (menuToggle.checked) {
                    menuToggle.checked = false;
                }
            });
        });
    }

    // --- Lógica para o FAB (Floating Action Button) ---
    const fabButton = document.querySelector('.fab-button');
    const fabLinks = document.querySelector('.fab-links');

    if (fabButton && fabLinks) {
        console.log('FAB elements found. Adding event listeners.');
        fabButton.addEventListener('click', function (event) {
            event.stopPropagation(); // Impede que o clique no botão feche imediatamente os links
            fabLinks.classList.toggle('show');
            console.log('FAB button clicked. Toggling show class.');
        });

        // Fecha os links do FAB se clicar fora deles
        document.addEventListener('click', function (event) {
            if (!fabLinks.contains(event.target) && !fabButton.contains(event.target)) {
                fabLinks.classList.remove('show');
                console.log('Clicked outside FAB. Removing show class.');
            }
        });
    }

    // --- VALIDAÇÃO DO FORMULÁRIO ---
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', () => {
            // Basic validation: check for '@'
            if (emailInput.value.includes('@') && emailInput.value.length > 3) {
                emailInput.style.borderColor = 'green';
            } else {
                emailInput.style.borderColor = 'red';
            }
        });
    }
});