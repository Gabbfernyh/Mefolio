function slugifyProjectTitle(value) {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const PROJECT_ALIASES = {
    newtech: 'newtech-store',
    'newtech-store': 'newtech-store',
    'previsao-do-tempo': 'previsao-do-tempo',
    'previs-a-o-do-tempo': 'previsao-do-tempo',
    pokedevs: 'pokedevs',
    'projeto-pokedevs': 'pokedevs',
    'my-card-linktree': 'my-card-linktree',
    mefolio: 'mefolio',
    'jordan-shoes': 'jordan-shoes',
    jordanshoes: 'jordan-shoes',
    'food-jp': 'food-jp',
    'food-jp-dev': 'food-jp',
    'house-of-the-dragon': 'house-of-the-dragon',
    'project-hod-szpc': 'house-of-the-dragon',
    'pobre-livre': 'pobre-livre',
    pobrelivre: 'pobre-livre',
    'burguer-house': 'burguer-house'
};

function getRepoSlug(card) {
    const repoLink = card.querySelector('a.access-repo[href*="github.com"]');
    if (!repoLink) return '';
    const href = repoLink.getAttribute('href') || '';
    const repoName = href.split('/').filter(Boolean).pop() || '';
    return slugifyProjectTitle(repoName);
}

function resolveProjectId(card, titleText, descriptions) {
    const titleSlug = slugifyProjectTitle(titleText);
    const repoSlug = getRepoSlug(card);
    const titleAlias = PROJECT_ALIASES[titleSlug] || titleSlug;
    const repoAlias = PROJECT_ALIASES[repoSlug] || repoSlug;

    if (descriptions[titleAlias]) return titleAlias;
    if (descriptions[repoAlias]) return repoAlias;
    if (descriptions[titleSlug]) return titleSlug;
    if (descriptions[repoSlug]) return repoSlug;

    return titleAlias || repoAlias;
}

function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function parseInlineMarkdown(text) {
    return text
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function markdownToHtml(markdownText) {
    const escaped = escapeHtml(markdownText || '');
    const lines = escaped.split('\n');
    const html = [];
    let inList = false;

    const closeListIfOpen = () => {
        if (inList) {
            html.push('</ul>');
            inList = false;
        }
    };

    for (const rawLine of lines) {
        const line = rawLine.trim();

        if (!line) {
            closeListIfOpen();
            continue;
        }

        if (line.startsWith('### ')) {
            closeListIfOpen();
            html.push(`<h3>${parseInlineMarkdown(line.slice(4))}</h3>`);
            continue;
        }

        if (line.startsWith('## ')) {
            closeListIfOpen();
            html.push(`<h2>${parseInlineMarkdown(line.slice(3))}</h2>`);
            continue;
        }

        if (line.startsWith('# ')) {
            closeListIfOpen();
            html.push(`<h1>${parseInlineMarkdown(line.slice(2))}</h1>`);
            continue;
        }

        if (line.startsWith('- ')) {
            if (!inList) {
                html.push('<ul>');
                inList = true;
            }
            html.push(`<li>${parseInlineMarkdown(line.slice(2))}</li>`);
            continue;
        }

        closeListIfOpen();
        html.push(`<p>${parseInlineMarkdown(line)}</p>`);
    }

    closeListIfOpen();
    return html.join('');
}

async function initProjectReadmeModal() {
    const cards = Array.from(document.querySelectorAll('.project-card'));
    if (!cards.length) return;

    const modal = document.getElementById('projectReadmeModal');
    const modalTitle = document.getElementById('projectReadmeTitle');
    const modalImage = document.getElementById('projectReadmeImage');
    const modalLiveLink = document.getElementById('projectReadmeLive');
    const modalRepoLink = document.getElementById('projectReadmeRepo');
    const modalBody = document.getElementById('projectReadmeBody');
    const closeBtn = document.getElementById('projectReadmeClose');

    if (!modal || !modalTitle || !modalImage || !modalLiveLink || !modalRepoLink || !modalBody || !closeBtn) return;

    let descriptions = {};
    try {
        const response = await fetch('src/data/project-descriptions.json', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Failed to load project descriptions: ${response.status}`);
        }
        descriptions = await response.json();
    } catch (error) {
        console.error(error);
    }

    const openModal = (title, readme, meta) => {
        modalTitle.textContent = title || 'Descricao do Projeto';
        modalImage.src = meta.imageSrc || '';
        modalImage.alt = meta.imageAlt || `Preview do projeto ${title || ''}`;

        if (meta.liveUrl) {
            modalLiveLink.href = meta.liveUrl;
            modalLiveLink.hidden = false;
        } else {
            modalLiveLink.hidden = true;
        }

        if (meta.repoUrl) {
            modalRepoLink.href = meta.repoUrl;
            modalRepoLink.hidden = false;
        } else {
            modalRepoLink.hidden = true;
        }

        modalBody.innerHTML = markdownToHtml(readme || 'Descricao ainda nao cadastrada.');
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('readme-modal-open');
    };

    const closeModal = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('readme-modal-open');
    };

    cards.forEach(card => {
        const titleEl = card.querySelector('.project-title');
        const buttonsContainer = card.querySelector('.project-buttons');
        const previewImage = card.querySelector('.project-image img');
        const liveLink = card.querySelector('a.access-project');
        const repoLink = card.querySelector('a.access-repo');
        if (!titleEl || !buttonsContainer) return;

        const titleText = titleEl.textContent.trim();
        const projectId = resolveProjectId(card, titleText, descriptions);
        const projectData = descriptions[projectId] || {};

        if (buttonsContainer.querySelector('.project-readme-btn')) return;

        const descBtn = document.createElement('button');
        descBtn.type = 'button';
        descBtn.className = 'project-readme-btn';
        descBtn.textContent = 'Ler README';
        descBtn.setAttribute('aria-label', `Ler descricao do projeto ${titleText}`);

        descBtn.addEventListener('click', () => {
            openModal(projectData.title || titleText, projectData.readme || '', {
                imageSrc: previewImage ? previewImage.src : '',
                imageAlt: previewImage ? previewImage.alt : '',
                liveUrl: liveLink ? liveLink.href : '',
                repoUrl: repoLink ? repoLink.href : ''
            });
        });

        buttonsContainer.appendChild(descBtn);
    });

    closeBtn.addEventListener('click', closeModal);

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

document.addEventListener('DOMContentLoaded', initProjectReadmeModal);
