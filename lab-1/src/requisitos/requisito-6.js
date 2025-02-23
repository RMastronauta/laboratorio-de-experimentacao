import { GIT_AUTH_TOKEN, GIT_GRAPHQL_URL } from "../service/git-service.js";
import { request, gql } from "graphql-request";
import { createCsv } from "../utils/create-csv.util.js";

const GET_CLOSED_ISSUES_COUNT = gql`
  query ($owner: String!, $repo: String!) {
    repository(owner: $owner, name: $repo) {
      issues(states: CLOSED) {
        totalCount
      }
    }
  }
`;

const getClosedIssuesCount = async (repoOwner, repoName) => {
  try {
    const response = await request(
      GIT_GRAPHQL_URL,
      GET_CLOSED_ISSUES_COUNT,
      {
        owner: repoOwner,
        repo: repoName,
      },
      {
        Authorization: `Bearer ${GIT_AUTH_TOKEN}`,
        "User-Agent": "GraphQL-Client",
      }
    );

    return response.repository.issues.totalCount || 0;
  } catch (error) {
    console.error(
      `Erro ao buscar issues fechadas do repositório ${repoName}:`,
      error
    );
    return 0;
  }
};

async function getPercentRepositoriesWithMoreThan30ClosedIssues(
  arrayRepositories
) {
  if (!arrayRepositories || arrayRepositories.length === 0) {
    console.log("Nenhum repositório encontrado.");
    return 0;
  }

  const resultRepCsv = [];

  const results = await Promise.all(
    arrayRepositories.map(async (repo) => {
      const closedIssuesCount = await getClosedIssuesCount(
        repo.owner.login,
        repo.name
      );
      resultRepCsv.push({
        name: repo.name,
        owner: repo.owner.login,
        language: repo?.primaryLanguage?.name || "não encontrado",
        stargazerCount: repo.stargazerCount,
        createdAt: repo.createdAt,
        closedIssues: closedIssuesCount,
        meetsReleaseCriteria: closedIssuesCount > 30 ? "true" : "false",
      });

      return closedIssuesCount > 30 ? 1 : 0;
    })
  );

  const countRepositories = results.reduce((acc, val) => acc + val, 0);
  const totalRepositories = arrayRepositories.length;

  saveCsv(resultRepCsv);

  const percentage = (countRepositories / totalRepositories) * 100;

  return percentage;
}

const saveCsv = (data) => {
  createCsv(data, "csv/requisito-6.csv");
};

export { getPercentRepositoriesWithMoreThan30ClosedIssues };
