const GITHUB_USERNAME = 'Gabbfernyh';
const LOCAL_STATS_PATH = 'src/data/github-stats.json';

function getProjectsCountElement() {
    return document.getElementById('projects-count');
}

function setProjectsCount(value) {
    const projectsCountEl = getProjectsCountElement();

    if (!projectsCountEl || typeof value !== 'number' || Number.isNaN(value)) {
        return false;
    }

    projectsCountEl.textContent = String(value);
    return true;
}

async function getLocalGithubStats() {
    const response = await fetch(LOCAL_STATS_PATH, {
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error(`Failed to load github-stats.json: ${response.status}`);
    }

    const data = await response.json();

    if (typeof data.repos === 'number') {
        return data.repos;
    }

    if (typeof data.public_repos === 'number') {
        return data.public_repos;
    }

    if (typeof data.count === 'number') {
        return data.count;
    }

    throw new Error('Invalid repository count field in github-stats.json');
}

async function getGithubStats() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
            headers: {
                Accept: 'application/vnd.github+json'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`GitHub API request failed: ${response.status}`);
        }

        const data = await response.json();

        if (typeof data.public_repos !== 'number') {
            throw new Error('Invalid public_repos field returned by GitHub API');
        }

        return data.public_repos;
    } catch (apiError) {
        console.warn('Failed to load GitHub stats from API, falling back to local JSON.', apiError);

        try {
            return await getLocalGithubStats();
        } catch (localError) {
            console.error('Failed to load fallback GitHub stats:', localError);
            return null;
        }
    }
}

async function updateGithubStats() {
    const experienceYearsEl = document.getElementById('experience-years');
    const MANUAL_EXPERIENCE = 5;

    if (experienceYearsEl) {
        experienceYearsEl.textContent = String(MANUAL_EXPERIENCE);
    }

    if (!getProjectsCountElement()) return;

    try {
        const localRepos = await getLocalGithubStats();
        setProjectsCount(localRepos);
    } catch (localError) {
        console.warn('Failed to load local GitHub stats before API sync.', localError);
    }

    const totalRepos = await getGithubStats();
    if (totalRepos !== null) {
        setProjectsCount(totalRepos);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateGithubStats, { once: true });
} else {
    updateGithubStats();
}
