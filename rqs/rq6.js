import { fetchAllRepositories } from './repositories.js';
import { request, gql } from 'graphql-request';

const gitAuthToken = process.env.GIT_AUTH_TOKEN;
const GIT_GRAPHQL_URL = "https://api.github.com/graphql";

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
        let totalReleases = 0;
        let cursor = null;
        const perPage = 100;
        const maxPages = 10;
        
        for (let page = 0; page < maxPages; page++) {
            const query = gql`
                query($owner: String!, $repo: String!, $perPage: Int!, $cursor: String) {
                    repository(owner: $owner, name: $repo) {
                        issues(first: $perPage, after: $cursor) {
                            totalCount
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

            const response = await request({
                url: GIT_GRAPHQL_URL,
                document: query,
                variables,
                requestHeaders: {
                    Authorization: `Bearer ${gitAuthToken}`,
                    "User-Agent": "GraphQL-Client",
                }
            });

            const releasesData = response.repository.issues;
            totalReleases += releasesData.totalCount;

            cursor = releasesData.pageInfo.endCursor;

            if (!releasesData.pageInfo.hasNextPage) break;
        }
        return totalReleases;
    } catch (error) {
        console.error(`Erro ao buscar issues fechadas do repositório ${repoName}:`, error);
        return 0;
    }
};

async function getPercentRepositoriesWithMoreThan30ClosedIssues() {
    const arrayRepositories = await fetchAllRepositories();
    if (arrayRepositories.length === 0) {
        return "Nenhum repositório encontrado.";
    }

    let countRepositories = 0;

    for (const repo of arrayRepositories) {
        const closedIssuesCount = await getClosedIssuesCount(repo.owner.login, repo.name);
        if (closedIssuesCount > 30) {
            countRepositories++;
        }
    }

    const totalRepositories = arrayRepositories.length;
    const percentage = ((countRepositories / totalRepositories) * 100);

    return percentage;
}

export { getPercentRepositoriesWithMoreThan30ClosedIssues };
