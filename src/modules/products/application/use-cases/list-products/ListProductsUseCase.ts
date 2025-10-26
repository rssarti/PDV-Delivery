import { inject, injectable } from 'inversify';
import { IProductRepository } from '../../../domain/interfaces/IProductRepository';
import { Product } from '../../../domain/entities';
import { PRODUCT_TYPES } from '../../../types';
import { ListProductsDTO } from './ListProductsDTO';

@injectable()
export class ListProductsUseCase {
  constructor(
    @inject(PRODUCT_TYPES.IProductRepository)
    private productRepository: IProductRepository
  ) {}

  async execute(filters: ListProductsDTO = {}): Promise<Product[]> {
    return await this.productRepository.findAll(filters);
  }
}
