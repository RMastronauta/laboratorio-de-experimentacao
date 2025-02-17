import { fetchAllRepositories } from './repositories.js';
const { request, gql } = await import('graphql-request'); 

const gitAuthToken = process.env.GIT_AUTH_TOKEN;
const GIT_GRAPHQL_URL = "https://api.github.com/graphql";

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
                query ($owner: String!, $repo: String!, $perPage: Int!, $cursor: String) {
                    repository(owner: $owner, name: $repo) {
                        pullRequests(states: MERGED, first: $perPage, after: $cursor, orderBy: {field: CREATED_AT, direction: DESC}) {
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
                cursor: cursor  
            };

            const response = await request({
                url: GIT_GRAPHQL_URL,
                document: query,
                variables,
                requestHeaders: {
                    Authorization: `Bearer ${gitAuthToken}`,
                    "User-Agent": "GraphQL-Client"
                }
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

const prAcceptedNumberCriteria = 1000;

async function getResponse() {
    const arrayRepositories = await fetchAllRepositories();
    let numberOfReposThatHasMoreThan1000Prs = 0;

    for (const repo of arrayRepositories) {
        let ownerName = repo.owner.login;
        let repositoryName = repo.name;

        let accepted = await getAcceptedPullRequests(ownerName, repositoryName);
        if (accepted >= prAcceptedNumberCriteria) {
            numberOfReposThatHasMoreThan1000Prs++;
        }
    }

    const totalRepositories = arrayRepositories.length;
    return (numberOfReposThatHasMoreThan1000Prs / totalRepositories) * 100;
}

export {
    getResponse
};
