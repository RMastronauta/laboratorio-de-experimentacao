import { createChart } from "../utils/create-chart.util.js";
import { createCsv } from "../utils/create-csv.util.js";

const resultRepFilterMetric = [];

async function getResponseReq2(arrayRepositories) {
  arrayRepositories.map(async (repo) => {
    let percentAccepted =
      (repo.mergedPullRequests.totalCount / repo.pullRequests.totalCount) * 100;

    resultRepFilterMetric.push({
      name: repo.name,
      owner: repo.owner.login,
      language: repo?.primaryLanguage?.name || "não encontrado",
      stargazerCount: repo.stargazerCount,
      createdAt: repo.createdAt,
      percentAccepted: percentAccepted,
    });
  });

  await saveChart(resultRepFilterMetric);

  saveCsv(resultRepFilterMetric);

  let response = 0;
  resultRepFilterMetric.map((result) => {
    if (result.percentAccepted > 70) {
      response++;
    }
  });

  return response;
}

async function saveChart(listRepositories) {
  const percentRanges = {
    "0-20%": 0,
    "21-40%": 0,
    "41-60%": 0,
    "61-80%": 0,
    "81-100%": 0,
  };

  listRepositories.forEach((repo) => {
    if (repo.percentAccepted <= 20) percentRanges["0-20%"]++;
    else if (repo.percentAccepted <= 40) percentRanges["21-40%"]++;
    else if (repo.percentAccepted <= 60) percentRanges["41-60%"]++;
    else if (repo.percentAccepted <= 70) percentRanges["61-70%"]++;
    else if (repo.percentAccepted <= 80) percentRanges["71-80%"]++;
    else percentRanges["81-100%"]++;
  });

  const config = {
    type: "bar",
    data: {
      labels: Object.keys(percentRanges),
      datasets: [
        {
          label: "Repositorios",
          data: Object.values(percentRanges),
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Percentual de repositórios com mais de 70% Pull Requests aceitos",
      },
      plugins: {
        datalabels: {
          align: "center",
          formatter: (value) => value,
          color: "white",
          font: {
            weight: "bold",
          },
        },
      },
    },
  };

  await createChart(config, "requisito-2");
}

const saveCsv = (data) => {
  createCsv(data, "csv/requisito-2.csv");
};

export { getResponseReq2 };
