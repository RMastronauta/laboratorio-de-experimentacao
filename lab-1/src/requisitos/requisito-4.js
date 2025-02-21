import { differenceInMonths } from "date-fns";
import { createCsv } from "../utils/create-csv.util.js";

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

  saveCsv(resultRepCsv);

  if (arrayRepositories.length === 0) return 0; // Evita divisão por zero

  return (totalOldRepositories / arrayRepositories.length) * 100;
}

const saveCsv = (data) => {
  createCsv(data, "csv/requisito-4.csv");
};

export { getTempoMedioAtualizacaoRepositories };
