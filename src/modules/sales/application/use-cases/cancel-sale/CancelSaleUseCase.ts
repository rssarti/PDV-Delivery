import { ISaleRepository } from '../../../domain/repositories/ISaleRepository';

export class CancelSaleUseCase {
  constructor(private saleRepository: ISaleRepository) {}

  async execute(id: string, reason: string): Promise<void> {
    if (!id) {
      throw new Error('Sale ID is required');
    }

    if (!reason) {
      throw new Error('Cancellation reason is required');
    }

    // Use repository method which uses domain logic
    await this.saleRepository.cancel(id, reason);
  }
}
