import { GitService } from './service/git.service';
import { MetricsService } from './service/metrics.service';

const init = async () => {
  const gitService = new GitService();
  // const repositories = await gitService.getRepositories(10);
  const pathCloneRep = await gitService.cloneRepository(
    'https://github.com/krahets/hello-algo',
    'hello-algo',
  );

  const metricsService = new MetricsService();

  const metricsResult = await metricsService.CK(pathCloneRep, 'hello-algo');

  console.log(metricsResult);
};

init();
