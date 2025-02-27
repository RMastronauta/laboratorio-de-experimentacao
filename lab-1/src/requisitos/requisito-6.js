import { createCsv } from "../utils/create-csv.util.js";
import { createChart } from "../utils/create-chart.util.js";

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

  await saveIssuesChart(arrayRepositories)
  saveCsv(resultRepIssuesCsv);

  let response = 0;
  resultRepIssuesCsv.map(result => {
    if (result.percentClosed > 30) {
      response++;
    }
  });

  return (response/arrayRepositories.length)*100;

}

async function saveIssuesChart(arrayRepositories) {
  const issueBuckets = {
    "0-20%": 0,
    "20-40%": 0,
    "40-60%": 0,
    "60-80%": 0,
    "80-100%": 0,
  };

  for (const repo of arrayRepositories) {
    if (repo.issues.totalCount === 0) continue;
    
    let percentClosed = (repo.closedIssues.totalCount / repo.issues.totalCount) * 100;

    if (percentClosed <= 20) issueBuckets["0-20%"]++;
    else if (percentClosed <= 40) issueBuckets["20-40%"]++;
    else if (percentClosed <= 60) issueBuckets["40-60%"]++;
    else if (percentClosed <= 80) issueBuckets["60-80%"]++;
    else issueBuckets["80-100%"]++;
  }

  const config = {
    type: "bar",
    data: {
      labels: Object.keys(issueBuckets),
      datasets: [
        {
          label: "Distribuição de Percentual de Issues Fechadas",
          data: Object.values(issueBuckets),
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  await createChart(config, "requisito-6");
}

const saveCsv = (data) => {
  createCsv(data, "csv/requisito-6.csv");
};

export { getPercentRepositoriesWithMoreThan30ClosedIssues };
