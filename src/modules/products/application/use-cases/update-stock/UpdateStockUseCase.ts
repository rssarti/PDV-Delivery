import { inject, injectable } from 'inversify';
import { IProductRepository } from '../../../domain/interfaces/IProductRepository';
import { Product } from '../../../domain/entities/index';
import { PRODUCT_TYPES } from '../../../types';

export interface UpdateStockRequest {
  productId: string;
  quantity: number;
  operation: 'ADD' | 'REMOVE';
  batchNumber?: string;
  expirationDate?: Date;
}

@injectable()
export class UpdateStockUseCase {
  constructor(
    @inject(PRODUCT_TYPES.IProductRepository)
    private productRepository: IProductRepository
  ) {}

  async execute(request: UpdateStockRequest): Promise<Product> {
    const product = await this.productRepository.findById(request.productId);
    if (!product) {
      throw new Error('Produto não encontrado');
    }

    if (request.operation === 'ADD') {
      product.addStock(
        request.quantity,
        request.batchNumber,
        request.expirationDate
      );
    } else if (request.operation === 'REMOVE') {
      product.removeStock(request.quantity);
    }

    return await this.productRepository.save(product);
  }
}
