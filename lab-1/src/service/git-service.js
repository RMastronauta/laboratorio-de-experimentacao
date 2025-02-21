import dotenv from "dotenv";
import { request, gql } from "graphql-request";
import { progressBarStep } from "../utils/progress-bar.util.js";

dotenv.config();

const GIT_GRAPHQL_URL = process.env.GIT_BASE_URL;
const GIT_AUTH_TOKEN = process.env.GIT_AUTH_TOKEN;
const QUANTITY_PERMITED_SEARCH_REPOSITORIES_BY_REQ = 10;

const getRepositories = async (skip) => {
  try {
    const variables = {
      perPage: QUANTITY_PERMITED_SEARCH_REPOSITORIES_BY_REQ,
      after: skip,
    };

    const queryGetRepositories = gql`
      query ($perPage: Int!, $after: String) {
        search(
          query: "stars:>10000"
          type: REPOSITORY
          first: $perPage
          after: $after
        ) {
          edges {
            node {
              ... on Repository {
                name
                owner {
                  login
                }
                primaryLanguage {
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

    const { search } = await request({
      url: GIT_GRAPHQL_URL,
      document: queryGetRepositories,
      variables,
      requestHeaders: {
        Authorization: `Bearer ${GIT_AUTH_TOKEN}`,
        "User-Agent": "GraphQL-Client",
      },
    });

    return {
      repositories: search.edges.map((edge) => edge.node),
      cursor: search.edges.at(-1).cursor,
    };
  } catch (error) {
    console.error("Erro ao buscar repositórios:", error);

    return [];
  }
};

const getRepositoriesQuantity = async (quantity) => {
  const listRepositories = [];
  let cursorAux = null;
  console.log(`Carregando repositorios | ${quantity}`);

  while (listRepositories.length < quantity) {
    progressBarStep(listRepositories.length, quantity);
    const missingAmount = quantity - listRepositories.length;

    const { repositories, cursor } = await getRepositories(cursorAux);
    cursorAux = cursor;

    if (!repositories || repositories?.length == 0) {
      break;
    }

    if (missingAmount > listRepositories.length) {
      listRepositories.push(...repositories);
      continue;
    }

    const addRepositories = listRepositories.slice(0, missingAmount);

    listRepositories.push(...addRepositories);
  }

  progressBarStep(listRepositories.length, quantity);
  console.log(`Carregado todos repositorios | ${listRepositories.length}`);

  return listRepositories;
};

export { getRepositoriesQuantity, GIT_GRAPHQL_URL, GIT_AUTH_TOKEN };
