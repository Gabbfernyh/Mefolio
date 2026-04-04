async function getGithubStats() {
    try {
        const response = await fetch('src/data/github-stats.json', {
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
    } catch (error) {
        console.error('Failed to load local GitHub stats:', error);
        return null;
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
