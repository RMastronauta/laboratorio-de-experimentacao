import { createChart } from "../utils/create-chart.util.js";
import { createCsv } from "../utils/create-csv.util.js";

const resultRepFilterMetric = [];
var numberOfReposWithMoreThan10Releases = 0;

async function getPercentReleases(arrayRepositories) {
  arrayRepositories.map(async (repo) => {
    if (repo.releases.totalCount > 10) {
      numberOfReposWithMoreThan10Releases++;
    }

    resultRepFilterMetric.push({
      name: repo.name,
      owner: repo.owner.login,
      language: repo?.primaryLanguage?.name || "não encontrado",
      stargazerCount: repo.stargazerCount,
      createdAt: repo.createdAt,
      totalReleases: repo.releases.totalCount,
    });
  });

  await saveChart(resultRepFilterMetric);

  saveCsv(resultRepFilterMetric);

  const totalRepositories = arrayRepositories.length;

  return (numberOfReposWithMoreThan10Releases / totalRepositories) * 100;
}

async function saveChart(listRepositories) {
  const percentRanges = {
    "0-9": 0,
    "10-ou-mais": 0,
  };

  listRepositories.forEach((repo) => {
    if (repo.totalReleases < 10) percentRanges["0-9"]++;
    else percentRanges["10-ou-mais"]++;
  });

  const config = {
    type: "pie",
    data: {
      labels: Object.keys(percentRanges),
      datasets: [
        {
          data: Object.values(percentRanges),
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Número de repositórios com mais de 10 releases",
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

  await createChart(config, "requisito-3");
}

const saveCsv = (data) => {
  createCsv(data, "csv/requisito-3.csv");
};

export { getPercentReleases };
