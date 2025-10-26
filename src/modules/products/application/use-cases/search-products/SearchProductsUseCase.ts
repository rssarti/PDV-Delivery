import { inject, injectable } from 'inversify';
import { IProductRepository } from '../../../domain/interfaces/IProductRepository';
import { Product } from '../../../domain/entities';
import { PRODUCT_TYPES } from '../../../types';
import { SearchProductsDTO } from './SearchProductsDTO';

@injectable()
export class SearchProductsUseCase {
  constructor(
    @inject(PRODUCT_TYPES.IProductRepository)
    private productRepository: IProductRepository
  ) {}

  async execute(request: SearchProductsDTO): Promise<Product[]> {
    const products = await this.productRepository.searchByName(request.query);

    if (request.limit) {
      return products.slice(0, request.limit);
    }

    return products;
  }
}
