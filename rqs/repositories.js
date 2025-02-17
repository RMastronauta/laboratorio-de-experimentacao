import dotenv from 'dotenv';
import { request, gql } from 'graphql-request';

dotenv.config();

const GIT_GRAPHQL_URL = 'https://api.github.com/graphql';
const gitAuthToken = "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";

const searchesNumber = 10;
const sizePerPage = 10; 
const totalRepositories = searchesNumber * sizePerPage;

let cachedRepositories = null;

const GET_REPOSITORIES_QUERY = gql`
    query($perPage: Int!, $after: String) 
    {
        search(query: "stars:>10000", type: REPOSITORY, first: $perPage, after: $after) 
        {
            edges 
            {
                node 
                {
                    ... on Repository 
                    {
                        name
                        owner 
                        {
                            login
                        }
                        primaryLanguage 
                        {
                            name
                        }
                        stargazerCount
                        createdAt
                        updatedAt
                    }
                }
                cursor
            }
        }
    }
`;

const getRepositories = async (afterCursor) => {
    try {
        const variables = {
            perPage: sizePerPage,
            after: afterCursor,  
        };

        const response = await request({
            url: GIT_GRAPHQL_URL,
            document: GET_REPOSITORIES_QUERY,
            variables,
            requestHeaders: {
                Authorization: `Bearer ${gitAuthToken}`,
                "User-Agent": "GraphQL-Client"
            }
        });

        return {
            repositories: response.search.edges.map(edge => edge.node),
            cursor: response.search.edges.length > 0 ? response.search.edges[response.search.edges.length - 1].cursor : null
        };
    } catch (error) {
        console.error("Erro ao buscar repositórios:", error);
        return { repositories: [], cursor: null };
    }
};

const fetchAllRepositories = async () => {
    if (cachedRepositories) {
        return cachedRepositories;
    }

    let repositories = [];
    let afterCursor = null;

    for (let index = 0; index < searchesNumber; index++) {
        const { repositories: pageRepositories, cursor } = await getRepositories(afterCursor);
        repositories.push(...pageRepositories);
        afterCursor = cursor; 
        if (!afterCursor) break; 
    }

    cachedRepositories = repositories;
    return cachedRepositories;
};

export { fetchAllRepositories, totalRepositories };