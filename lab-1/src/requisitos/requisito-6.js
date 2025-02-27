import { createCsv } from "../utils/create-csv.util.js";

const resultRepIssuesCsv = [];
async function getPercentRepositoriesWithMoreThan30ClosedIssues(
  arrayRepositories
) {
  if (!arrayRepositories || arrayRepositories.length === 0) {
    console.log("Nenhum repositório encontrado.");
    return 0;
  }

  arrayRepositories.map(async (repo) => {
    if (repo.issues.totalCount === 0) return;

    let percentClosed = (repo.closedIssues.totalCount / repo.issues.totalCount) * 100;

    resultRepIssuesCsv.push({
      name: repo.name,
      owner: repo.owner.login,
      language: repo?.primaryLanguage?.name || "não encontrado",
      stargazerCount: repo.stargazerCount,
      createdAt: repo.createdAt,
      percentClosed: percentClosed,
    });
  });

  saveCsv(resultRepIssuesCsv);

  let response = 0;
  resultRepIssuesCsv.map(result => {
    if (result.percentClosed > 30) {
      response++;
    }
  });

  return (response/arrayRepositories.length)*100;

}

const saveCsv = (data) => {
  createCsv(data, "csv/requisito-6.csv");
};

export { getPercentRepositoriesWithMoreThan30ClosedIssues };
