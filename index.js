import { getPercentOldRepositories } from './rqs/rq1.js';
import { getResponse } from './rqs/rq2.js';
import { getPercentReleases } from './rqs/rq3.js';
import { getTempoMedioAtualizacaoRepositories } from './rqs/rq4.js';
import { getRepositoriosPossuemLinguagemPopular } from './rqs/rq5.js';
import { getPercentRepositoriesWithMoreThan30ClosedIssues } from './rqs/rq6.js';

async function main() {
    try {
        const percentOldRepos = await getPercentOldRepositories();
        const percentReposWithManyPRs = await getResponse();
        const percentReleases = await getPercentReleases();
        const tempoDeAtualizacaoMeses  = await getTempoMedioAtualizacaoRepositories();
        const repositoriosLinguagemPopular  = await getRepositoriosPossuemLinguagemPopular();
        const totalClosedIssues = await getPercentRepositoriesWithMoreThan30ClosedIssues();
        console.log(`% de repositórios populares que são antigos (mais de 5 anos): ${percentOldRepos.toFixed(2)}%`);
        console.log(`% de repositórios populares que receberam mais de 100 contribuições: ${percentReposWithManyPRs.toFixed(2)}%`);
        console.log(`% de repositorios populares que tem 10 ou mais releases: ${percentReleases.toFixed(2)}% `)
        console.log(`% de repositorios populares que atualizaram o seus repositorios a um periodo de um ano: ${tempoDeAtualizacaoMeses.toFixed(2)}% `);
        console.log(`% de repositorios populares que possuem linguagem popular: ${repositoriosLinguagemPopular.toFixed(2)}% `);
        console.log(`% de repositorios populares com mais de 30 issues fechadas: ${totalClosedIssues.toFixed(2)}% `);
    } catch (error) {
        console.error("Erro ao calcular a porcentagem:", error);
    }
}

main();
