import { fetchAllRepositories, totalRepositories } from "./repositories.js";

const consideredAge = 5;

async function getPercentOldRepositories(arrayRepositories) {
  let totalOldRepositories = 0;
  const today = new Date();

  for (const repo of arrayRepositories) {
    const createdAt = new Date(repo.createdAt);
    const ageDiffs = (today - createdAt) / (1000 * 60 * 60 * 24 * 365); //pega diff de idade em anos

    if (ageDiffs >= consideredAge) {
      totalOldRepositories++;
    }
  }

  let oldPercentRepos = (totalOldRepositories / arrayRepositories.length) * 100;
  return oldPercentRepos;
}

export { getPercentOldRepositories };
