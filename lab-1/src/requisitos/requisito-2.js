import { GIT_AUTH_TOKEN, GIT_GRAPHQL_URL } from "../service/git-service.js";

const { request, gql } = await import("graphql-request");

const getAcceptedPullRequests = async (repoOwner, repoName) => {
  try {
    let totalMergedPRs = 0;
    let cursor = null;
    const perPage = 10;
    const maxPages = 10;

    //pegando pelo status de MERGED pq na documentação oficial
    //diz que esse status é referente aos mrs que foram fechados por terem sido mergeados
    for (let page = 0; page < maxPages; page++) {
      const query = gql`
        query (
          $owner: String!
          $repo: String!
          $perPage: Int!
          $cursor: String
        ) {
          repository(owner: $owner, name: $repo) {
            pullRequests(
              states: MERGED
              first: $perPage
              after: $cursor
              orderBy: { field: CREATED_AT, direction: DESC }
            ) {
              nodes {
                title
                createdAt
                mergedAt
                author {
                  login
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        }
      `;

      const variables = {
        owner: repoOwner,
        repo: repoName,
        perPage: perPage,
        cursor: cursor,
      };

      const response = await request(GIT_GRAPHQL_URL, query, variables, {
        Authorization: `Bearer ${GIT_AUTH_TOKEN}`,
        "User-Agent": "GraphQL-Client",
      });

      const prData = response.repository.pullRequests;

      totalMergedPRs += prData.nodes.length;

      cursor = prData.pageInfo.endCursor;

      if (!prData.pageInfo.hasNextPage) break;
    }

    return totalMergedPRs;
  } catch (error) {
    console.error("Erro ao buscar Pull Requests:", error);
    return 0;
  }
};

const prAcceptedNumberCriteria = 100;

async function getResponseReq2(arrayRepositories) {
  const results = await Promise.all(
    arrayRepositories.map(async (repo) => {
      const accepted = await getAcceptedPullRequests(
        repo.owner.login,
        repo.name
      );
      return accepted >= prAcceptedNumberCriteria ? 1 : 0;
    })
  );

  const numberOfReposThatHasMoreThan100Prs = results.reduce(
    (acc, val) => acc + val,
    0
  );

  const totalRepositories = arrayRepositories.length;

  return (numberOfReposThatHasMoreThan100Prs / totalRepositories) * 100;
}

export { getResponseReq2 };
