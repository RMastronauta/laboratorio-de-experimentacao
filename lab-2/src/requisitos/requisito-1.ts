import { GitService } from '../service/git.service';
import { createCsv } from '../utils/create-csv.util';

async function saveRepositoriesToCsv() {
  const gitService = new GitService();
  const quantity = 10;
  const repositories = await gitService.getRepositories(quantity);

  const formattedData = repositories.map((repo: any) => ({
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

  const filePath = '../csv/repositorio-1.csv';

  createCsv(formattedData, filePath);
}

saveRepositoriesToCsv();
