// Função para criar notificação temporária com barra de progresso
function createNotification(message, duration = 5000) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
        </div>
        <div class="progress-bar-container">
            <div class="progress-bar"></div>
        </div>
    `;

    // Adicionar ao body
    document.body.appendChild(notification);

    // Animação da barra de progresso
    const progressBar = notification.querySelector('.progress-bar');
    progressBar.style.animationDuration = `${duration}ms`;

    // Remover após o tempo especificado
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}
// Substituir alerts originais
function linkedinAlert(event) {
    event.preventDefault();
    setTimeout(() => {
        createNotification("Ops! Esta página ainda não está ativa. Aguarde 2026.");
    }, 100);
}

function curriculoAlert(event) {
    event.preventDefault();
    setTimeout(() => {
        createNotification("Ops! O currículo ainda não está finalizado. Aguarde o lançamento!");
    }, 100);
}


function portfolioAlert() {
    setTimeout(() => {
        createNotification("Olá! Bem-vindo! Que bom vê-lo por aqui. Espero que goste do que encontrar! 😉");
    }, 100);
}

// Mostra o alerta de boas-vindas ao carregar a página
document.addEventListener('DOMContentLoaded', portfolioAlert);