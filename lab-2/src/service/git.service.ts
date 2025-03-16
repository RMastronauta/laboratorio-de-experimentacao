import 'dotenv/config';
import fs from 'fs-extra';
import path from 'path';
import simpleGit from 'simple-git';

import { progressBarStep } from '../utils/progress-bar.util';
import {
  FindRepositoriesGitResponseDto,
  RepositoryGitResponseDto,
} from './dto/git-response.dto';
export class GitService {
  static GIT_GRAPHQL_URL = process.env.GIT_BASE_URL;
  static GIT_AUTH_TOKEN = process.env.GIT_AUTH_TOKEN;
  private static QUANTITY_PERMITED_SEARCH_REPOSITORIES_BY_REQ = 20;
  private static CLONE_DIR = path.join(__dirname, '../../clone_repositories');

  private async sendRequest(query: any, variables: any): Promise<any> {
    const { request } = await import('graphql-request');

    return await request({
      url: GitService.GIT_GRAPHQL_URL,
      document: query,
      variables,
      requestHeaders: {
        Authorization: `Bearer ${GitService.GIT_AUTH_TOKEN}`,
        'User-Agent': 'GraphQL-Client',
      },
    });
  }

  private async findRepositoriesInGithub(
    skip: number,
  ): Promise<FindRepositoriesGitResponseDto> {
    const { gql } = await import('graphql-request');

    const variables = {
      perPage: GitService.QUANTITY_PERMITED_SEARCH_REPOSITORIES_BY_REQ,
      skip,
    };

    const query = gql`
      query ($perPage: Int!, $skip: String) {
        search(
          query: "stars:>10000 language:Java"
          type: REPOSITORY
          first: $perPage
          after: $skip
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
                pullRequests {
                  totalCount
                }
                mergedPullRequests: pullRequests(states: MERGED) {
                  totalCount
                }
                issues {
                  totalCount
                }
                closedIssues: issues(states: [CLOSED]) {
                  totalCount
                }
                releases {
                  totalCount
                }
                url
              }
            }
            cursor
          }
        }
      }
    `;

    const { search: result } = await this.sendRequest(query, variables);

    return {
      repositories: result.edges.map((edge: any) => edge.node),
      cursor: result.edges.length > 0 ? result.edges.at(-1).cursor : null,
    };
  }

  async getRepositories(quantity: number): Promise<RepositoryGitResponseDto[]> {
    const listRepositories: RepositoryGitResponseDto[] = [];
    let cursorAux = null;
    console.log(`Carregando repositorios | ${quantity}`);

    while (listRepositories.length < quantity) {
      progressBarStep(listRepositories.length, quantity);
      const missingAmount = quantity - listRepositories.length;

      const { repositories, cursor } =
        await this.findRepositoriesInGithub(cursorAux);

      cursorAux = cursor;

      if (!repositories || repositories?.length == 0) {
        break;
      }

      const addRepositories = repositories.slice(0, missingAmount);

      listRepositories.push(...addRepositories);
    }

    progressBarStep(listRepositories.length, quantity);

    console.log(`\nCarregado todos repositorios | ${listRepositories.length}`);

    return listRepositories;
  }

  async cloneRepository(url: string, name: string): Promise<string> {
    fs.ensureDirSync(GitService.CLONE_DIR);

    const repoPath = path.join(GitService.CLONE_DIR, name);

    if (fs.existsSync(repoPath)) {
      return repoPath;
    }

    try {
      await simpleGit().clone(url, repoPath);

      return repoPath;
    } catch (e) {
      console.error(`Error cloning repository: ${e.message}`);

      throw null;
    }
  }
}
