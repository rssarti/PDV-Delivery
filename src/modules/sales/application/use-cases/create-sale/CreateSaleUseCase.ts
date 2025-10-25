import { Sale } from '../../../domain/entities/Sale';
import { ISaleRepository } from '../../../domain/repositories/ISaleRepository';
import { IClientQueryService } from '../../../../../shared/domain/services/IClientQueryService';
import { CreateSaleDTO } from './CreateSaleDTO';

export class CreateSaleUseCase {
  constructor(
    private saleRepository: ISaleRepository,
    private clientQueryService: IClientQueryService // 🎯 Dependência da interface compartilhada
  ) {}

  async execute(data: CreateSaleDTO): Promise<Sale> {
    if (data.customerId) {
      const clientExists = await this.clientQueryService.validateClientExists(
        data.customerId
      );

      if (!clientExists) {
        throw new Error(`Client with ID ${data.customerId} not found`);
      }

      const isClientActive = await this.clientQueryService.isClientActive(
        data.customerId
      );

      if (!isClientActive) {
        throw new Error(`Client with ID ${data.customerId} is not active`);
      }
    }

    const sale = new Sale({
      items: data.items,
      total: data.total,
      paymentMethod: data.paymentMethod,
      customerId: data.customerId,
    });

    const savedSale = await this.saleRepository.save(sale);

    return savedSale;
  }
}
