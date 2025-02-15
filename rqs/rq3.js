import { fetchAllRepositories } from './repositories.js';
const { request, gql } = await import('graphql-request');  // Importação dinâmica

const gitAuthToken = process.env.GIT_AUTH_TOKEN;
const GIT_GRAPHQL_URL = "https://api.github.com/graphql";
const consideredReleasesNumber = 2;

const getReleasesCount = async (repoOwner, repoName) => {
    try {
        let totalReleases = 0;
        let cursor = null;
        const perPage = 100;
        const maxPages = 10;

        for (let page = 0; page < maxPages; page++) {
            const query = gql`
                query($owner: String!, $repo: String!, $perPage: Int!, $cursor: String) {
                    repository(owner: $owner, name: $repo) {
                        refs(refPrefix: "refs/tags/", first: $perPage, after: $cursor) {
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

            const releasesData = response.repository.refs;
            totalReleases += releasesData.totalCount;

            cursor = releasesData.pageInfo.endCursor;

            if (!releasesData.pageInfo.hasNextPage) break;
        }

        return totalReleases;
    } catch (error) {
        console.error("Erro ao buscar Releases:", error);
        return 0;
    }
};

async function getPercentReleases() {
    const arrayRepositories = await fetchAllRepositories();
    let numberOfReposWithMoreThan100Releases = 0;

    for (const repo of arrayRepositories) {
        let ownerName = repo.owner.login;
        let repositoryName = repo.name;

        let releasesCount = await getReleasesCount(ownerName, repositoryName);
        
        if (releasesCount > consideredReleasesNumber) {
            numberOfReposWithMoreThan100Releases++;
        }
    }

    const totalRepositories = arrayRepositories.length;
    return (numberOfReposWithMoreThan100Releases / totalRepositories) * 100;
}

export {
    getPercentReleases
};
