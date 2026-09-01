/* eslint-disable no-console */
(function () {
    'use strict';

    /**
     * Cria uma notificação temporária com barra de progresso.
     * Mensagem é lida por tecnologias assistivas via role/aria-live.
     */
    const createNotification = (message, duration = 5000) => {
        const notification = document.createElement('div');
        notification.className = 'custom-notification';
        notification.setAttribute('role', 'status');
        notification.setAttribute('aria-live', 'polite');
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
            </div>
            <div class="progress-bar-container" aria-hidden="true">
                <div class="progress-bar"></div>
            </div>
        `;

        document.body.appendChild(notification);

        const progressBar = notification.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.animationDuration = `${duration}ms`;
        }

        // Remove com animação controlada por CSS (fadeOut)
        window.setTimeout(() => {
            notification.style.animation = 'fadeOut 0.32s ease-out forwards';
            window.setTimeout(() => {
                if (notification.parentNode) notification.parentNode.removeChild(notification);
            }, 320);
        }, duration);
    };

    // Alertas específicos
    const curriculoAlert = (event) => {
        if (event && typeof event.preventDefault === 'function') event.preventDefault();
        window.setTimeout(() => createNotification('Ops! O currículo ainda não está finalizado. Aguarde o lançamento!'), 160);
    };

    const portfolioAlert = () => {
        // delay pequeno após o loader para não competir com a transição
        window.setTimeout(() => createNotification('Olá! Bem-vindo! Que bom vê-lo por aqui.'), 240);
    };

    // Expor handlers para uso pontual (não polui global namespace)
    // Conecta curriculo-alerts se existirem elementos com a classe `js-curriculo-alert`
    const attachCurriculoHandlers = () => {
        const els = Array.from(document.querySelectorAll('.js-curriculo-alert'));
        els.forEach(el => el.addEventListener('click', curriculoAlert));
    };

    // Registra para disparar apenas quando a aplicação emitir `app:ready`
    document.addEventListener('app:ready', () => {
        try {
            portfolioAlert();
            attachCurriculoHandlers();
        } catch (err) {
            console.warn('alert.js: falha ao disparar alertas', err);
        }
    }, { once: true });

})();