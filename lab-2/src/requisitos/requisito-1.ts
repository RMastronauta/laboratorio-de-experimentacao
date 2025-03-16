import { RepositoryGitResponseDto } from 'src/service/dto/git-response.dto';

export class Requisito1 {
  private repositories: RepositoryGitResponseDto[];

  constructor(repositories: RepositoryGitResponseDto[]) {
    this.repositories = repositories;
  }
}
