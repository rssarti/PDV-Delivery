import { inject, injectable } from 'inversify';
import { IProductRepository } from '../../../domain/interfaces/IProductRepository';
import { Product, ProductProps } from '../../../domain/entities';
import { AvailabilityStatus } from '../../../domain/enums';
import { PRODUCT_TYPES } from '../../../types';
import { CreateProductDTO } from './CreateProductDTO';

@injectable()
export class CreateProductUseCase {
  constructor(
    @inject(PRODUCT_TYPES.IProductRepository)
    private productRepository: IProductRepository
  ) {}

  async execute(request: CreateProductDTO): Promise<Product> {
    await this.validateUniqueFields(request);

    const productProps: ProductProps = {
      name: request.name,
      description: request.description,
      type: request.type,
      categoryId: request.categoryId,
      unit: {
        baseUnit: request.baseUnit,
        baseQuantity: request.baseQuantity,
        fractionalUnit: request.fractionalUnit,
        fractionalQuantity: request.fractionalQuantity,
        conversionFactor: request.conversionFactor,
      },
      pricing: {
        costPrice: request.costPrice,
        salePrice: request.salePrice,
        suggestedPrice: request.suggestedPrice,
      },
      taxInfo: {
        ncm: request.ncm,
        cest: request.cest,
        icmsRate: request.icmsRate,
        pisRate: request.pisRate,
        cofinsRate: request.cofinsRate,
        origin: request.origin,
      },
      availability: {
        status: AvailabilityStatus.SEMPRE_DISPONIVEL,
      },
      eanCode: request.eanCode,
      internalCode: request.internalCode,
      images: request.images,
      preparationTime: request.preparationTime,
      minimumStock: request.minimumStock,
      currentStock: request.currentStock,
      canBeIngredient: request.canBeIngredient,
      needsRecipe: request.needsRecipe,
    };

    const product = new Product(productProps);
    return await this.productRepository.save(product);
  }

  private async validateUniqueFields(request: CreateProductDTO): Promise<void> {
    if (request.internalCode) {
      const existingByInternalCode =
        await this.productRepository.findByInternalCode(request.internalCode);
      if (existingByInternalCode) {
        throw new Error('Já existe um produto com este código interno');
      }
    }

    if (request.eanCode) {
      const existingByEanCode = await this.productRepository.findByEanCode(
        request.eanCode
      );
      if (existingByEanCode) {
        throw new Error('Já existe um produto com este código EAN');
      }
    }
  }
}
