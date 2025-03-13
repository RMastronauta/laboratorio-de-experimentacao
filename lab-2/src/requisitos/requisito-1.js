import { isAfter, addYears, differenceInYears } from "date-fns";
import { createCsv } from "../utils/create-csv.util.js";
import { createChart } from "../utils/create-chart.util.js";

const consideredAgeYear = 5;

const isRepositoryOld = (repository) => {
  const yearLimit = addYears(new Date(), -consideredAgeYear);
  const repositoryCreatedAt = new Date(repository.createdAt);

  return isAfter(yearLimit, repositoryCreatedAt);
};

async function getPercentOldRepositories(listRepositories) {
  const listRepositoriesOld = listRepositories.filter(isRepositoryOld);
  const totalOldRepositories = listRepositoriesOld.length;
  const oldPercentRepos =
    (totalOldRepositories / listRepositories.length) * 100;

  await saveChart(listRepositoriesOld);
  saveCsv(listRepositories);

  return oldPercentRepos;
}

async function saveChart(listRepositories) {
  const countByYear = listRepositories.reduce((acc, repo) => {
    const year = new Date(repo.createdAt).getFullYear();
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  const config = {
    type: "bar",
    data: {
      labels: Object.keys(countByYear),
      datasets: [
        {
          label: "Repositorios",
          data: Object.values(countByYear),
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Repositórios com mais de 5 anos",
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

  await createChart(config, "requisito-1");
}

function saveCsv(listRepositories) {
  const currentDate = new Date();
  const listRepositoriesAux = listRepositories.map((rep) => ({
    name: rep.name,
    owner: rep.owner.login,
    language: rep?.primaryLanguage?.name || "não encontrado",
    stargazerCount: rep.stargazerCount,
    createdAt: rep.createdAt,
    amountYear: differenceInYears(rep.createdAt, currentDate),
    isOld: isRepositoryOld(rep) ? "true" : "false",
  }));

  createCsv(listRepositoriesAux, "./csv/requisito-1.csv");
}

export { getPercentOldRepositories };
