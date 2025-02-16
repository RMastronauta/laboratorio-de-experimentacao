import { fetchAllRepositories } from './repositories.js';

// Lista de linguagens populares
const linguagensPopulares = new Set([
    "JavaScript",
    "Python",
    "Java",
    "PHP",
    "C#",
    "C++",
    "TypeScript",
    "Shell",
    "C",
    "HTML"
]);

async function getRepositoriosPossuemLinguagemPopular() {
    const arrayRepositories = await fetchAllRepositories();
    if (arrayRepositories.length === 0) return 0;

    let totalOldRepositories = 0;

    for (const repo of arrayRepositories) {
        const linguagemRepository = repo.primaryLanguage?.name || "";
        
        if (linguagensPopulares.has(linguagemRepository)) {
            totalOldRepositories++;
        }
    }

    return (totalOldRepositories / arrayRepositories.length) * 100;
}

export { getRepositoriosPossuemLinguagemPopular };
