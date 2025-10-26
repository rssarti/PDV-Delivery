import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import {
  IProductRepository,
  ProductFilters,
} from '../../domain/interfaces/IProductRepository';
import { Product } from '../../domain/entities/Product';
import { ProductEntity } from '../../../../shared/infra/database/typeorm/entities/ProductEntity';

import {
  ProductType,
  StockStatus,
  UnitType,
  ProductOrigin,
  AvailabilityStatus,
} from '../../domain/enums/index';
import { TYPES } from '../../../../shared/container/CoreContainer';

@injectable()
export class TypeORMProductRepository implements IProductRepository {
  private repository: Repository<ProductEntity>;

  constructor(
    @inject(TYPES.DataSource)
    private dataSource: DataSource
  ) {
    this.repository = dataSource.getRepository(ProductEntity);
  }

  async save(product: Product): Promise<Product> {
    const productEntity = this.domainToEntity(product);
    const savedEntity = await this.repository.save(productEntity);
    return this.entityToDomain(savedEntity);
  }

  async findById(id: string): Promise<Product | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['category'],
    });
    return entity ? this.entityToDomain(entity) : null;
  }

  async findByInternalCode(internalCode: string): Promise<Product | null> {
    const entity = await this.repository.findOne({
      where: { internalCode },
      relations: ['category'],
    });
    return entity ? this.entityToDomain(entity) : null;
  }

  async findByEanCode(eanCode: string): Promise<Product | null> {
    const entity = await this.repository.findOne({
      where: { eanCode },
      relations: ['category'],
    });
    return entity ? this.entityToDomain(entity) : null;
  }

  async findAll(filters?: ProductFilters): Promise<Product[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (filters) {
      if (filters.categoryId) {
        queryBuilder.andWhere('product.categoryId = :categoryId', {
          categoryId: filters.categoryId,
        });
      }

      if (filters.type) {
        queryBuilder.andWhere('product.type = :type', { type: filters.type });
      }

      if (filters.stockStatus) {
        queryBuilder.andWhere('product.stockStatus = :stockStatus', {
          stockStatus: filters.stockStatus,
        });
      }

      if (filters.isActive !== undefined) {
        queryBuilder.andWhere('product.isActive = :isActive', {
          isActive: filters.isActive,
        });
      }

      if (filters.canBeIngredient !== undefined) {
        queryBuilder.andWhere('product.canBeIngredient = :canBeIngredient', {
          canBeIngredient: filters.canBeIngredient,
        });
      }

      if (filters.needsRecipe !== undefined) {
        queryBuilder.andWhere('product.needsRecipe = :needsRecipe', {
          needsRecipe: filters.needsRecipe,
        });
      }

      if (filters.minStock !== undefined) {
        queryBuilder.andWhere('product.currentStock >= :minStock', {
          minStock: filters.minStock,
        });
      }

      if (filters.maxStock !== undefined) {
        queryBuilder.andWhere('product.currentStock <= :maxStock', {
          maxStock: filters.maxStock,
        });
      }

      if (filters.minPrice !== undefined) {
        queryBuilder.andWhere('product.salePrice >= :minPrice', {
          minPrice: filters.minPrice,
        });
      }

      if (filters.maxPrice !== undefined) {
        queryBuilder.andWhere('product.salePrice <= :maxPrice', {
          maxPrice: filters.maxPrice,
        });
      }

      if (filters.unit) {
        queryBuilder.andWhere('product.baseUnit = :unit', {
          unit: filters.unit,
        });
      }

      if (filters.searchTerm) {
        queryBuilder.andWhere(
          '(product.name ILIKE :searchTerm OR product.description ILIKE :searchTerm)',
          { searchTerm: `%${filters.searchTerm}%` }
        );
      }
    }

    const entities = await queryBuilder.getMany();
    return entities.map(entity => this.entityToDomain(entity));
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    return this.findAll({ categoryId });
  }

  async findIngredients(): Promise<Product[]> {
    return this.findAll({ type: ProductType.INSUMO, canBeIngredient: true });
  }

  async findFinalProducts(): Promise<Product[]> {
    return this.findAll({ type: ProductType.PRODUTO_FINAL });
  }

  async findLowStockProducts(): Promise<Product[]> {
    return this.findAll({ stockStatus: StockStatus.ESTOQUE_BAIXO });
  }

  async findExpiredProducts(): Promise<Product[]> {
    return this.findAll({ stockStatus: StockStatus.VENCIDO });
  }

  async update(id: string, productData: Partial<Product>): Promise<Product> {
    const existingProduct = await this.findById(id);
    if (!existingProduct) {
      throw new Error('Produto não encontrado');
    }

    const updatedEntity = this.domainToEntity(existingProduct);
    Object.assign(updatedEntity, this.domainToEntity(productData as Product));
    updatedEntity.id = id;

    const savedEntity = await this.repository.save(updatedEntity);
    return this.entityToDomain(savedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async updateStock(id: string, quantity: number): Promise<void> {
    await this.repository.update(id, { currentStock: quantity });
  }

  async searchByName(name: string): Promise<Product[]> {
    return this.findAll({ searchTerm: name });
  }

  async findAvailableNow(): Promise<Product[]> {
    return this.findAll({ isActive: true });
  }

  private domainToEntity(domain: Product): ProductEntity {
    const entity = new ProductEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.type = domain.type;
    entity.categoryId = domain.categoryId;
    entity.baseUnit = domain.unit.baseUnit;
    entity.baseQuantity = domain.unit.baseQuantity;
    entity.fractionalUnit = domain.unit.fractionalUnit;
    entity.fractionalQuantity = domain.unit.fractionalQuantity;
    entity.conversionFactor = domain.unit.conversionFactor;
    entity.costPrice = domain.pricing.costPrice;
    entity.salePrice = domain.pricing.salePrice;
    entity.suggestedPrice = domain.pricing.suggestedPrice;
    entity.profitMargin = domain.pricing.profitMargin;
    entity.promotionalPrice = domain.pricing.promotionalPrice;
    entity.promotionalPriceStartDate = domain.pricing.promotionalPriceStartDate;
    entity.promotionalPriceEndDate = domain.pricing.promotionalPriceEndDate;
    entity.ncm = domain.taxInfo.ncm;
    entity.cest = domain.taxInfo.cest;
    entity.icmsRate = domain.taxInfo.icmsRate;
    entity.pisRate = domain.taxInfo.pisRate;
    entity.cofinsRate = domain.taxInfo.cofinsRate;
    entity.origin = domain.taxInfo.origin;
    entity.availabilityStatus = domain.availability.status;
    entity.availableStartTime = domain.availability.availableStartTime;
    entity.availableEndTime = domain.availability.availableEndTime;
    entity.availableDays = domain.availability.availableDays;
    entity.seasonalStartDate = domain.availability.seasonalStartDate;
    entity.seasonalEndDate = domain.availability.seasonalEndDate;
    entity.eanCode = domain.eanCode;
    entity.internalCode = domain.internalCode;
    entity.qrCode = domain.qrCode;
    entity.images = domain.images;
    entity.preparationTime = domain.preparationTime;
    entity.minimumStock = domain.minimumStock;
    entity.currentStock = domain.currentStock;
    entity.stockStatus = domain.stockStatus;
    entity.expirationDate = domain.expirationDate;
    entity.batchNumber = domain.batchNumber;
    entity.isActive = domain.isActive;
    entity.canBeIngredient = domain.canBeIngredient;
    entity.needsRecipe = domain.needsRecipe;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  private entityToDomain(entity: ProductEntity): Product {
    return new Product({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      type: entity.type as ProductType,
      categoryId: entity.categoryId,
      unit: {
        baseUnit: entity.baseUnit as UnitType,
        baseQuantity: entity.baseQuantity,
        fractionalUnit: entity.fractionalUnit as UnitType,
        fractionalQuantity: entity.fractionalQuantity,
        conversionFactor: entity.conversionFactor,
      },
      pricing: {
        costPrice: entity.costPrice,
        salePrice: entity.salePrice,
        suggestedPrice: entity.suggestedPrice,
        profitMargin: entity.profitMargin,
        promotionalPrice: entity.promotionalPrice,
        promotionalPriceStartDate: entity.promotionalPriceStartDate,
        promotionalPriceEndDate: entity.promotionalPriceEndDate,
      },
      taxInfo: {
        ncm: entity.ncm,
        cest: entity.cest,
        icmsRate: entity.icmsRate,
        pisRate: entity.pisRate,
        cofinsRate: entity.cofinsRate,
        origin: entity.origin as ProductOrigin,
      },
      availability: {
        status: entity.availabilityStatus as AvailabilityStatus,
        availableStartTime: entity.availableStartTime,
        availableEndTime: entity.availableEndTime,
        availableDays: entity.availableDays,
        seasonalStartDate: entity.seasonalStartDate,
        seasonalEndDate: entity.seasonalEndDate,
      },
      eanCode: entity.eanCode,
      internalCode: entity.internalCode,
      qrCode: entity.qrCode,
      images: entity.images,
      preparationTime: entity.preparationTime,
      minimumStock: entity.minimumStock,
      currentStock: entity.currentStock,
      stockStatus: entity.stockStatus as StockStatus,
      expirationDate: entity.expirationDate,
      batchNumber: entity.batchNumber,
      isActive: entity.isActive,
      canBeIngredient: entity.canBeIngredient,
      needsRecipe: entity.needsRecipe,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
