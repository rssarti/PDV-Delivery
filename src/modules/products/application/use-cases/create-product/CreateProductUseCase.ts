import { inject, injectable } from 'inversify';
import { IProductRepository } from '../../../domain/interfaces/IProductRepository';
import { Product, ProductProps } from '../../../domain/entities/index';
import {
  ProductType,
  UnitType,
  ProductOrigin,
  AvailabilityStatus,
} from '../../../domain/enums/index';
import { PRODUCT_TYPES } from '../../../types';

export interface CreateProductRequest {
  name: string;
  description?: string;
  type: ProductType;
  categoryId: string;
  baseUnit: UnitType;
  baseQuantity: number;
  fractionalUnit?: UnitType;
  fractionalQuantity?: number;
  conversionFactor?: number;
  costPrice: number;
  salePrice: number;
  suggestedPrice?: number;
  ncm?: string;
  cest?: string;
  icmsRate?: number;
  pisRate?: number;
  cofinsRate?: number;
  origin: ProductOrigin;
  eanCode?: string;
  internalCode?: string;
  images?: string[];
  preparationTime?: number;
  minimumStock?: number;
  currentStock?: number;
  canBeIngredient?: boolean;
  needsRecipe?: boolean;
}

@injectable()
export class CreateProductUseCase {
  constructor(
    @inject(PRODUCT_TYPES.IProductRepository)
    private productRepository: IProductRepository
  ) {}

  async execute(request: CreateProductRequest): Promise<Product> {
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

  private async validateUniqueFields(
    request: CreateProductRequest
  ): Promise<void> {
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
