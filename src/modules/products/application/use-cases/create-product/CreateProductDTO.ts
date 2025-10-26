import {
  ProductType,
  UnitType,
  ProductOrigin,
} from '../../../domain/enums/index';

export interface CreateProductDTO {
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
