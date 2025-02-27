import { createCsv } from "../utils/create-csv.util.js";

const resultRepPrCsv = [];

async function getResponseReq2(arrayRepositories) {

  arrayRepositories.map(async (repo) => {

    let percentAccepted = (repo.mergedPullRequests.totalCount / repo.pullRequests.totalCount) * 100;

    resultRepPrCsv.push({
      name: repo.name,
      owner: repo.owner.login,
      language: repo?.primaryLanguage?.name || "não encontrado",
      stargazerCount: repo.stargazerCount,
      createdAt: repo.createdAt,
      percentAccepted: percentAccepted,
    });
  })

  saveCsv(resultRepPrCsv);
  let response = 0;
  resultRepPrCsv.map(result => {
    if (result.percentAccepted > 70) {
      response++;
    }
  })

  return response;
}

const saveCsv = (data) => {
  createCsv(data, "csv/requisito-2.csv");
};

export { getResponseReq2 };
