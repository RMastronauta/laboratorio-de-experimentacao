import { GitService } from '../service/git.service';
import { createCsv } from '../utils/create-csv.util';

export async function saveRepositoriesToCsv(listRepositories) {
  try {

    // Formatação dos dados
    const formattedData = listRepositories.map((repo: any) => ({
      name: repo.name,
      owner: repo.owner.login,
      primaryLanguage: repo.primaryLanguage?.name || 'Unknown',
      stargazerCount: repo.stargazerCount,
      createdAt: repo.createdAt,
      updatedAt: repo.updatedAt,
      pullRequests: repo.pullRequests.totalCount,
      mergedPullRequests: repo.mergedPullRequests?.totalCount || 0,
      issues: repo.issues.totalCount,
      closedIssues: repo.closedIssues?.totalCount || 0,
      releases: repo.releases.totalCount,
    }));
    const filePath = "./csv/requisito-1.csv";
    createCsv(formattedData, filePath);
  } catch (error) {
    console.error('Erro ao salvar os repositórios no CSV:', error);
  }
}
