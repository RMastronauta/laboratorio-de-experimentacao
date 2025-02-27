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
  if (!arrayRepositories || arrayRepositories.length === 0) return 0;

  const resultRepFilterMetric = [];
  let totalOldRepositories = 0;

  for (const repo of arrayRepositories) {
    const linguagemRepository = repo.primaryLanguage?.name || "não encontrado";

    resultRepFilterMetric.push({
      name: repo.name,
      owner: repo.owner.login,
      language: linguagemRepository,
      stargazerCount: repo.stargazerCount,
      createdAt: repo.createdAt,
      meetsReleaseCriteria: linguagensPopulares.has(linguagemRepository) ? "true" : "false",
    });

    if (linguagensPopulares.has(linguagemRepository)) {
      totalOldRepositories++;
    }
  }

  await saveChart(resultRepFilterMetric);
  saveCsv(resultRepFilterMetric);

  return (totalOldRepositories / arrayRepositories.length) * 100;
}

async function saveChart(arrayRepositories) {
  const countByLanguage = {};

  for (const repo of arrayRepositories) {
    const linguagem = repo.language;
    if (linguagensPopulares.has(linguagem)) {
      countByLanguage[linguagem] = (countByLanguage[linguagem] || 0) + 1;
    }
  }


  if (Object.keys(countByLanguage).length === 0) {
    console.warn("Nenhuma linguagem popular encontrada nos repositórios.");
    return;
  }

  const config = {
    type: "bar", // Gráfico de barras
    data: {
      labels: Object.keys(countByLanguage),
      datasets: [
        {
          label: "Quantidade de Repositórios",
          data: Object.values(countByLanguage),
          backgroundColor: [
            "#f1c40f", "#e74c3c", "#3498db", "#2ecc71", "#9b59b6", 
            "#34495e", "#e67e22", "#1abc9c", "#7f8c8d", "#d35400"
          ],
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
          text: "Repositórios por Linguagem Popular",
          font: {
            size: 18,
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Linguagens",
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Quantidade de Repositórios",
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
