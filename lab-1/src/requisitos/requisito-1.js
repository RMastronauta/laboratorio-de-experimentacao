import { isAfter, addYears } from "date-fns";

const consideredAgeYear = 5;

const isRepositoryOld = (repository) => {
  const yearLimit = addYears(new Date(), -consideredAgeYear);
  const repositoryCreatedAt = new Date(repository.createdAt);

  return isAfter(yearLimit, repositoryCreatedAt);
};

function getPercentOldRepositories(listRepositories) {
  const listRepositoriesOld = listRepositories.filter(isRepositoryOld);
  const totalOldRepositories = listRepositoriesOld.length;
  const oldPercentRepos =
    (totalOldRepositories / listRepositories.length) * 100;

  return oldPercentRepos;
}

export { getPercentOldRepositories };
