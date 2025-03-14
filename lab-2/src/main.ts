import { GitService } from './service/git.service';

const init = async () => {
  const gitService = new GitService();
  const repositories = await gitService.getRepositories(10);

  console.log(repositories);
};

init();
