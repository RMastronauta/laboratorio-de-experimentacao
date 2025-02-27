import { getPercentOldRepositories } from "./requisitos/requisito-1.js";
import { getResponseReq2 } from "./requisitos/requisito-2.js";
import { getPercentReleases } from "./requisitos/requisito-3.js";
import { getTempoMedioAtualizacaoRepositories } from "./requisitos/requisito-4.js";
import { getRepositoriosPossuemLinguagemPopular } from "./requisitos/requisito-5.js";
import { getPercentRepositoriesWithMoreThan30ClosedIssues } from "./requisitos/requisito-6.js";
import { getRepositoriesQuantity } from "./service/git-service.js";

const start = async () => {
  const listRepositories = await getRepositoriesQuantity(50);
  // await req1(listRepositories);
  await req2(listRepositories);
  // await req3(listRepositories);
  // await req4(listRepositories);
  // await req5(listRepositories);
  // await req6(listRepositories);
};

const req1 = async (listRepositories) => {
  const result = await getPercentOldRepositories(listRepositories);

  console.log(
    `% de repositórios populares que são antigos (mais de 5 anos): ${result.toFixed(
      2
    )}%`
  );
};

const req2 = async (listRepositories) => {
  const result = await getResponseReq2(listRepositories);

  console.log(
    `% de repositórios que tem mais de 70% de pull requests aceitas(mergeadas): ${result.toFixed(
      2
    )}%`
  );
};

const req3 = async (listRepositories) => {
  const result = await getPercentReleases(listRepositories);

  console.log(
    `% de repositorios populares que tem 10 ou mais releases: ${result.toFixed(
      2
    )}% `
  );
};

const req4 = async (listRepositories) => {
  const result = await getTempoMedioAtualizacaoRepositories(listRepositories);

  console.log(
    `% de repositorios populares que atualizaram o seus repositorios a um periodo de um ano: ${result.toFixed(
      2
    )}% `
  );
};

const req5 = async (listRepositories) => {
  const result = await getRepositoriosPossuemLinguagemPopular(listRepositories);

  console.log(
    `% de repositorios populares que possuem linguagem popular: ${
      result?.toFixed(2) || 0
    }% `
  );
};

const req6 = async (listRepositories) => {
  const result = await getPercentRepositoriesWithMoreThan30ClosedIssues(
    listRepositories
  );

  console.log(
    `% de repositorios populares com mais de 30 issues fechadas: ${result.toFixed(
      2
    )}% `
  );
};

start();
