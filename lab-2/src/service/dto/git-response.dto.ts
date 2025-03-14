export class RepositoryGitResponseDto {}

export class FindRepositoriesGitResponseDto {
  repositories: RepositoryGitResponseDto[];
  cursor: string;
}
