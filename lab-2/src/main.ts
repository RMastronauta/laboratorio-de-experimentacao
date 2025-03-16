import { GitService } from './service/git.service';

const init = async () => {
  const gitService = new GitService();
  const repositories = await gitService.getRepositories(10);
  gitService.cloneRepository(repositories[0].url, repositories[0].name);
  console.log(repositories[0]);
};

init();
