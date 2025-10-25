import { IDatabaseService } from '../../../../../shared/infra/database/services/DatabaseService';
import { SaleEntity } from '../../../../../shared/infra/database/typeorm/entities/SaleEntity';
import { CreateSaleDTO } from './CreateSaleDTO';

export class CreateSaleUseCase {
  constructor(private databaseService: IDatabaseService) {}

  async execute(data: CreateSaleDTO) {
    this.validateSaleData(data);

    const saleData: Partial<SaleEntity> = {
      items: data.items,
      total: data.total,
      paymentMethod: data.paymentMethod,
      customerId: data.customerId,
      status: 'OPEN',
      createdAt: new Date(),
    };

    const createdSale = await this.databaseService.sales.save(saleData);

    return createdSale;
  }

  private validateSaleData(data: CreateSaleDTO): void {
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      throw new Error('Sale must have at least one item');
    }

    if (data.total <= 0) {
      throw new Error('Sale total must be greater than zero');
    }

    if (!data.paymentMethod) {
      throw new Error('Payment method is required');
    }

    for (const item of data.items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        throw new Error(
          'All items must have a valid product ID and positive quantity'
        );
      }
    }
  }
}
