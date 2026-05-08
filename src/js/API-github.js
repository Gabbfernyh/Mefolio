const GITHUB_USERNAME = 'Gabbfernyh';
const LOCAL_STATS_PATH = 'src/data/github-stats.json';

async function getLocalGithubStats() {
    const response = await fetch(LOCAL_STATS_PATH, {
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error(`Failed to load github-stats.json: ${response.status}`);
    }

    const data = await response.json();

    if (typeof data.repos !== 'number') {
        throw new Error('Invalid repos field in github-stats.json');
    }

    return data.repos;
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
    const projectsCountEl = document.getElementById('projects-count');
    const experienceYearsEl = document.getElementById('experience-years');
    const MANUAL_EXPERIENCE = 4;

    if (experienceYearsEl) {
        experienceYearsEl.textContent = String(MANUAL_EXPERIENCE);
    }

    if (!projectsCountEl) return;

    const totalRepos = await getGithubStats();
    if (totalRepos !== null) {
        projectsCountEl.textContent = String(totalRepos);
    }
}

document.addEventListener('DOMContentLoaded', updateGithubStats);
