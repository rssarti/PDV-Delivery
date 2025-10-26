import { Product } from '../entities/Product.js';
import { ProductType, StockStatus, UnitType } from '../enums/index.js';

export interface ProductFilters {
  categoryId?: string;
  type?: ProductType;
  stockStatus?: StockStatus;
  isActive?: boolean;
  canBeIngredient?: boolean;
  needsRecipe?: boolean;
  minStock?: number;
  maxStock?: number;
  minPrice?: number;
  maxPrice?: number;
  unit?: UnitType;
  searchTerm?: string;
}

export interface IProductRepository {
  save(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findByInternalCode(internalCode: string): Promise<Product | null>;
  findByEanCode(eanCode: string): Promise<Product | null>;
  findAll(filters?: ProductFilters): Promise<Product[]>;
  findByCategory(categoryId: string): Promise<Product[]>;
  findIngredients(): Promise<Product[]>;
  findFinalProducts(): Promise<Product[]>;
  findLowStockProducts(): Promise<Product[]>;
  findExpiredProducts(): Promise<Product[]>;
  update(id: string, product: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
  updateStock(id: string, quantity: number): Promise<void>;
  searchByName(name: string): Promise<Product[]>;
  findAvailableNow(): Promise<Product[]>;
}
