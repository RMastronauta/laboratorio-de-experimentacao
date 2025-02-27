import { createChart } from "../utils/create-chart.util.js";
import { createCsv } from "../utils/create-csv.util.js";

const resultRepFilterMetric = [];

async function getResponseReq2(arrayRepositories) {
  resultRepFilterMetric.length = 0; // Resetando a lista antes de adicionar novos dados

  arrayRepositories.forEach((repo) => {
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

  let response = resultRepFilterMetric.filter((result) => result.percentAccepted >= 70).length;
  return response;
}

async function saveChart(listRepositories) {
  const percentRanges = {
    "0-20%": 0,
    "21-40%": 0,
    "41-60%": 0,
    "61-69%": 0,
    "70% ou mais": 0,
  };

  listRepositories.forEach((repo) => {
    if (repo.percentAccepted <= 20) percentRanges["0-20%"]++;
    else if (repo.percentAccepted <= 40) percentRanges["21-40%"]++;
    else if (repo.percentAccepted <= 60) percentRanges["41-60%"]++;
    else if (repo.percentAccepted <= 69) percentRanges["61-69%"]++;
    else percentRanges["70% ou mais"]++;
  });

  console.log("Dados para o gráfico:", percentRanges); // Log para depuração

  const config = {
    type: "bar",
    data: {
      labels: Object.keys(percentRanges),
      datasets: [
        {
          label: "Repositórios",
          data: Object.values(percentRanges),
          backgroundColor: ["#f1c40f", "#e74c3c", "#3498db", "#2ecc71", "#9b59b6"],
          borderColor: "#2c3e50",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Quantidade de Repositórios por Percentual de Pull Requests Aceitos",
          font: {
            size: 16,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Quantidade de Repositórios",
          },
        },
        x: {
          title: {
            display: true,
            text: "Percentual de Pull Requests Aceitos",
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
