import { createCsv } from "../utils/create-csv.util.js";

const resultRepPrCsv = [];
var numberOfReposWithMoreThan10Releases = 0;

async function getPercentReleases(arrayRepositories) {
  
  arrayRepositories.map(async (repo) => {

    if(repo.releases.totalCount > 10) {
      numberOfReposWithMoreThan10Releases++
    }

    resultRepPrCsv.push({
      name: repo.name,
      owner: repo.owner.login,
      language: repo?.primaryLanguage?.name || "não encontrado",
      stargazerCount: repo.stargazerCount,
      createdAt: repo.createdAt,
      totalReleases: repo.releases.totalCount,
    });
  })
  saveCsv(resultRepPrCsv);

  const totalRepositories = arrayRepositories.length;

  return (numberOfReposWithMoreThan10Releases / totalRepositories) * 100;
}

const saveCsv = (data) => {
  createCsv(data, "csv/requisito-3.csv");
};

export { getPercentReleases };
