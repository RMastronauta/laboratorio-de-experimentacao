import { isAfter, addYears, differenceInYears } from "date-fns";
import { createCsv } from "../utils/create-csv.util.js";

const consideredAgeYear = 5;

const isRepositoryOld = (repository) => {
  const yearLimit = addYears(new Date(), -consideredAgeYear);
  const repositoryCreatedAt = new Date(repository.createdAt);

  return isAfter(yearLimit, repositoryCreatedAt);
};

function getPercentOldRepositories(listRepositories) {
  const listRepositoriesOld = listRepositories.filter(isRepositoryOld);
  const listRepositoriesNew = listRepositories.filter(
    (req) => !isRepositoryOld(req)
  );
  const totalOldRepositories = listRepositoriesOld.length;
  const oldPercentRepos =
    (totalOldRepositories / listRepositories.length) * 100;

  saveCsv(listRepositories);

  return oldPercentRepos;
}

function saveCsv(listRepositories) {
  const currentDate = new Date();
  const listRepositoriesAux = listRepositories.map((rep) => ({
    name: rep.name,
    owner: rep.owner.login,
    language: rep?.primaryLanguage?.name || "não encontrado",
    stargazerCount: rep.stargazerCount,
    createdAt: rep.createdAt,
    amountYear: differenceInYears(rep.createdAt, currentDate),
    isOld: isRepositoryOld(rep) ? "true" : "false",
  }));

  createCsv(listRepositoriesAux, "./csv/requisito-1.csv");
}

export { getPercentOldRepositories };
