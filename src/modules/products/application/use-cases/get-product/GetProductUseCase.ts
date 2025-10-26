import { inject, injectable } from 'inversify';
import { IProductRepository } from '../../../domain/interfaces/IProductRepository';
import { Product } from '../../../domain/entities/index';
import { PRODUCT_TYPES } from '../../../types';
import { GetProductDTO } from './GetProductDTO';

@injectable()
export class GetProductUseCase {
  constructor(
    @inject(PRODUCT_TYPES.IProductRepository)
    private productRepository: IProductRepository
  ) {}

  async execute(id: GetProductDTO): Promise<Product | null> {
    return await this.productRepository.findById(id);
  }
}
