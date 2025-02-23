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

  const resultRepCsv = [];

  let totalOldRepositories = 0;

  for (const repo of arrayRepositories) {
    const linguagemRepository = repo.primaryLanguage?.name || "";

    resultRepCsv.push({
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

  saveCsv(resultRepCsv);

  return (totalOldRepositories / arrayRepositories.length) * 100;
}

const saveCsv = (data) => {
  createCsv(data, "csv/requisito-5.csv");
};

export { getRepositoriosPossuemLinguagemPopular };
