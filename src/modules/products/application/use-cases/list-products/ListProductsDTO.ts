import {
  ProductType,
  UnitType,
  StockStatus,
} from '../../../domain/enums/index';

export interface ListProductsDTO {
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
