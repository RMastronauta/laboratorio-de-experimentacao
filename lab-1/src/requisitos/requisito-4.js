import { differenceInMonths } from "date-fns";
import { createCsv } from "../utils/create-csv.util.js";
import { createChart } from "../utils/create-chart.util.js";

async function getTempoMedioAtualizacaoRepositories(arrayRepositories) {
  let totalOldRepositories = 0;
  const resultRepCsv = [];
  const today = new Date();

  for (const repo of arrayRepositories) {
    const updatedAt = new Date(repo.updatedAt);
    const ageDiffs = differenceInMonths(updatedAt, today);

    resultRepCsv.push({
      name: repo.name,
      owner: repo.owner.login,
      language: repo?.primaryLanguage?.name || "não encontrado",
      stargazerCount: repo.stargazerCount,
      createdAt: repo.createdAt,
      differenceMonthsUpdated: ageDiffs,
      meetsReleaseCriteria: ageDiffs < 12 ? "true" : "false",
    });

    if (ageDiffs < 12)
      // Considerando repositórios com mais de 1 ano sem atualização
      totalOldRepositories++;
  }

  console.log(arrayRepositories.length)
  saveCsv(resultRepCsv);
  await saveUpdateChart(arrayRepositories)

  if (arrayRepositories.length === 0) return 0; // Evita divisão por zero

  return (totalOldRepositories / arrayRepositories.length) * 100;
}

async function saveUpdateChart(arrayRepositories) {
  const today = new Date();
  const updatesByMonth = Array(12).fill(0); // Array para armazenar contagem de atualizações por tempo desde a última atualização

  for (const repo of arrayRepositories) {
    const updatedAt = new Date(repo.updatedAt);
    const monthsAgo = today.getMonth() - updatedAt.getMonth() + (today.getFullYear() - updatedAt.getFullYear()) * 12;
    
    if (monthsAgo >= 0 && monthsAgo < 12) {
      updatesByMonth[monthsAgo] += 1;
    }
  }

  const config = {
    type: "bar",
    data: {
      labels: ["0 meses", "1 mês", "2 meses", "3 meses", "4 meses", "5 meses", "6 meses", "7 meses", "8 meses", "9 meses", "10 meses", "11 meses"],
      datasets: [
        {
          label: "Tempo desde a última atualização (em meses)",
          data: updatesByMonth,
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
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

  await createChart(config, "requisito-4");
}

const saveCsv = (data) => {
  createCsv(data, "csv/requisito-4.csv");
};

export { getTempoMedioAtualizacaoRepositories };
