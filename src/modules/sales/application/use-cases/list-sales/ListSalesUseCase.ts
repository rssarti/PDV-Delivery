import { IDatabaseService } from '../../../../../shared/infra/database/services/DatabaseService';
import { ListSalesDTO } from './ListSalesDTO';

export class ListSalesUseCase {
  constructor(private databaseService: IDatabaseService) {}

  async execute(options: ListSalesDTO = {}) {
    const { limit = 50, offset = 0, status } = options;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    const sales = await this.databaseService.sales.findAll({
      limit,
      offset,
    });

    return sales;
  }
}
