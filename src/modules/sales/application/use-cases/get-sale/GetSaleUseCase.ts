import { ISaleRepository } from '../../../domain/repositories/ISaleRepository';
import { Sale } from '../../../domain/entities/Sale';
import { GetSaleDTO } from './GetSaleDTO';

export class GetSaleUseCase {
  constructor(private saleRepository: ISaleRepository) {}

  async execute(id: GetSaleDTO): Promise<Sale | null> {
    if (!id) {
      throw new Error('Sale ID is required');
    }

    const sale = await this.saleRepository.findById(id);

    if (!sale) {
      throw new Error(`Sale with ID ${id} not found`);
    }

    return sale;
  }
}
