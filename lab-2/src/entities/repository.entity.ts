import { Optional } from 'src/utils/optional';

import { MetricsCkResponseDto } from '../service/dto/metrics-response.dto';
import { GitService } from '../service/git.service';
import { MetricsService } from '../service/metrics.service';

interface IProps {
  name: string;
  owner: string;
  primaryLanguage: string;
  stargazerCount: number;
  createdAt: Date;
  updatedAt: Date;
  url: string;
  metricsCk: MetricsCkResponseDto;
}

export class RepositoryEntity {
  constructor(props: IProps) {
    this.name = props.name;
    this.owner = props.owner;
    this.primaryLanguage = props.primaryLanguage;
    this.stargazerCount = props.stargazerCount;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.url = props.url;
    this.metricsCk = props.metricsCk;
  }

  name: string;
  owner: string;
  primaryLanguage: string;
  stargazerCount: number;
  createdAt: Date;
  updatedAt: Date;
  url: string;
  metricsCk: MetricsCkResponseDto;

  static async create(
    repository: Optional<IProps, 'metricsCk'>,
  ): Promise<RepositoryEntity> {
    const metricsService = new MetricsService();
    const gitService = new GitService();

    const pathCloneRepository = await gitService.cloneRepository(
      repository.url,
      repository.name,
    );

    const metricsResult = await metricsService.CK(
      pathCloneRepository,
      repository.name,
    );

    return new RepositoryEntity({
      ...repository,
      metricsCk: metricsResult,
    });
  }
}
