import { ISaleRepository } from '../../../domain/repositories/ISaleRepository';
import { Sale } from '../../../domain/entities/Sale';
import { ListSalesDTO } from './ListSalesDTO';

export class ListSalesUseCase {
  constructor(private saleRepository: ISaleRepository) {}

  async execute(options: ListSalesDTO = {}): Promise<Sale[]> {
    const { limit = 50, offset = 0, status } = options;

    const sales = await this.saleRepository.findAll({
      limit,
      offset,
      status,
    });

    return sales;
  }
}
