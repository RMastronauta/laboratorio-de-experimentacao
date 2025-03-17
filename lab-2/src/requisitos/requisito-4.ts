import { RepositoryEntity } from '../entities/repository.entity';
import { createChart } from '../utils/create-chart.util';
import { createCsv } from '../utils/create-csv.util';
import { Requisito4ResponseDto } from './dto/requisitos-response.dto';
import { requisito4Mapper } from './mapper/requisitos.mapper';

export class Requisito4 {
  constructor(repositories: RepositoryEntity[]) {
    this.repositories = repositories;
  }
  private readonly question = `RQ 04. Qual a relação entre o tamanho dos repositórios e as suas características de qualidade?`;
  private results: Requisito4ResponseDto[] | null = null;
  private repositories: RepositoryEntity[];

  async saveCsv(): Promise<void> {
    if (!this.verifyResults) {
      return;
    }

    createCsv(this.results, './resultados/csv/requisito-2.csv');
  }

  async saveChart() {
    if (!this.verifyResults) {
      return;
    }

    const config = {
      type: 'bar',
      data: {
        // labels: Object.keys(countByYear),
        // datasets: [
        //   {
        //     label: 'Repositorios',
        //     data: Object.values(countByYear),
        //   },
        // ],
      },
      options: {
        title: {
          display: true,
          text: this.question,
        },
        plugins: {
          datalabels: {
            align: 'center',
            formatter: (value) => value,
            color: 'white',
            font: {
              weight: 'bold',
            },
          },
        },
      },
    };

    await createChart(
      config,
      `requisito-3-quantidade-repositorios-${this.results.length}`,
    );
  }

  verifyResults(): boolean {
    if (this.results) return true;

    console.log('==============================================');
    console.log(this.question);
    console.log(
      `Ainda não foi possível obter os resultados, execute o método execute() antes de chamar este método.`,
    );
    console.log('==============================================');

    return false;
  }

  toStringResult(): void {
    if (!this.verifyResults) {
      return;
    }

    console.log('==============================================');
    console.log(this.question);
    console.log(
      `Resultado: ${this.results.reduce((acc, curr) => acc + curr.popularity, 0) / this.results.length}`,
    );
    console.log('==============================================');
  }

  async execute(): Promise<Requisito4ResponseDto[]> {
    const result = this.repositories.map(requisito4Mapper);

    this.results = result;

    await this.saveCsv();

    return this.results;
  }
}
