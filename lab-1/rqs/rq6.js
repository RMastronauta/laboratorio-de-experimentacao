import { fetchAllRepositories } from "./repositories.js";
import { request, gql } from "graphql-request";

const GIT_GRAPHQL_URL = "https://api.github.com/graphql";
const gitAuthToken = process.env.GIT_TOKEN;

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
        Authorization: `Bearer ${gitAuthToken}`,
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

async function getPercentRepositoriesWithMoreThan30ClosedIssues() {
  const arrayRepositories = await fetchAllRepositories();
  if (!arrayRepositories || arrayRepositories.length === 0) {
    console.log("Nenhum repositório encontrado.");
    return 0;
  }

  const results = await Promise.all(
    arrayRepositories.map(async (repo) => {
      const closedIssuesCount = await getClosedIssuesCount(
        repo.owner.login,
        repo.name
      );
      return closedIssuesCount > 30 ? 1 : 0;
    })
  );

  const countRepositories = results.reduce((acc, val) => acc + val, 0);
  const totalRepositories = arrayRepositories.length;

  const percentage = (countRepositories / totalRepositories) * 100;

  return percentage;
}

export { getPercentRepositoriesWithMoreThan30ClosedIssues };
