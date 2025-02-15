import { getPercentOldRepositories } from './rqs/rq1.js';
import { getResponse } from './rqs/rq2.js';
import { getPercentReleases } from './rqs/rq3.js';

async function main() {
    try {
        const percentOldRepos = await getPercentOldRepositories();
        const percentReposWithManyPRs = await getResponse();
        const percentReleases = await getPercentReleases();

        console.log(`% de repositórios populares que são antigos (mais de 5 anos): ${percentOldRepos.toFixed(2)}%`);
        console.log(`% de repositórios populares que receberam mais de 1000 contribuições: ${percentReposWithManyPRs.toFixed(2)}%`);
        console.log(`% de repositorios populares que tem 2 ou mais releases: ${percentReleases.toFixed(2)}% `)
    } catch (error) {
        console.error("Erro ao calcular a porcentagem:", error);
    }
}

main();
