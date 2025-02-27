import { createChart } from "../utils/create-chart.util.js";
import { createCsv } from "../utils/create-csv.util.js";

// Lista de linguagens populares
const linguagensPopulares = new Set([
  "JavaScript",
  "Python",
  "Java",
  "PHP",
  "C#",
  "C++",
  "TypeScript",
  "Shell",
  "C",
  "HTML",
]);

async function getRepositoriosPossuemLinguagemPopular(arrayRepositories) {
  if (arrayRepositories.length === 0) return 0;
  const resultRepFilterMetric = [];

  let totalOldRepositories = 0;

  for (const repo of arrayRepositories) {
    const linguagemRepository = repo.primaryLanguage?.name || "";

    resultRepFilterMetric.push({
      name: repo.name,
      owner: repo.owner.login,
      language: repo?.primaryLanguage?.name || "não encontrado",
      stargazerCount: repo.stargazerCount,
      createdAt: repo.createdAt,
      language: linguagemRepository,
      meetsReleaseCriteria: linguagensPopulares.has(linguagemRepository)
        ? "true"
        : "false",
    });

    if (linguagensPopulares.has(linguagemRepository)) {
      totalOldRepositories++;
    }
  }

  await saveChart(resultRepFilterMetric);
  saveCsv(resultRepFilterMetric);

  return (totalOldRepositories / arrayRepositories.length) * 100;
}

async function saveChart(listRepositories) {
  const countByLanguage = listRepositories.reduce((acc, repo) => {
    if (repo.meetsReleaseCriteria && repo.language != "") {
      acc[`${repo.language}`] = (acc[`${repo.language}`] || 0) + 1;

      return acc;
    }

    acc["outros"] = (acc["outros"] || 0) + 1;

    return acc;
  }, {});

  const config = {
    type: "doughnut",
    data: {
      labels: Object.keys(countByLanguage),
      datasets: [
        {
          data: Object.values(countByLanguage),
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Quantidade de repositórios que utilizam linguagens populares.",
      },
      plugins: {
        doughnutlabel: {
          labels: [{ text: listRepositories.length, font: { size: 20 } }],
        },
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

  await createChart(config, "requisito-5");
}

const saveCsv = (data) => {
  createCsv(data, "csv/requisito-5.csv");
};

export { getRepositoriosPossuemLinguagemPopular };
