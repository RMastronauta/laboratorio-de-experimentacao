import { GitService } from './service/git.service';
import { saveRepositoriesToCsv } from './requisitos/requisito-1';

const init = async () => {
  try {
    const gitService = new GitService();
    const repositories = await gitService.getRepositories(10);
    await saveRepositoriesToCsv(repositories);
  } catch (error) {
    console.error('Erro ao salvar os repositórios no CSV:', error);
  }
};
init();
