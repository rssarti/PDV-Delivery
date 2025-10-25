import { IDatabaseService } from '../../../../../shared/infra/database/services/DatabaseService';
import { GetSaleDTO } from './GetSaleDTO';

export class GetSaleUseCase {
  constructor(private databaseService: IDatabaseService) {}

  async execute(id: GetSaleDTO) {
    if (!id) {
      throw new Error('Sale ID is required');
    }

    const sale = await this.databaseService.sales.findById(id);

    if (!sale) {
      throw new Error(`Sale with ID ${id} not found`);
    }

    return sale;
  }
}
