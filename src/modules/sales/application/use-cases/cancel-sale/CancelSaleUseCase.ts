import { IDatabaseService } from '../../../../../shared/infra/database/services/DatabaseService';

export class CancelSaleUseCase {
  constructor(private databaseService: IDatabaseService) {}

  async execute(id: string, reason: string) {
    if (!id) {
      throw new Error('Sale ID is required');
    }

    if (!reason) {
      throw new Error('Cancellation reason is required');
    }

    const sale = await this.databaseService.sales.findById(id);

    if (!sale) {
      throw new Error(`Sale with ID ${id} not found`);
    }

    if (sale.status === 'CANCELLED') {
      throw new Error(`Sale with ID ${id} is already cancelled`);
    }

    await this.databaseService.sales.cancel(id, reason);
  }
}
