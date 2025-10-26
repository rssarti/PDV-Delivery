import { v4 as uuidv4 } from 'uuid';
import {
  ProductType,
  UnitType,
  StockStatus,
  ProductOrigin,
  AvailabilityStatus,
} from '../enums/index.js';

export interface ProductTaxInfo {
  ncm?: string;
  cest?: string;
  icmsRate?: number;
  pisRate?: number;
  cofinsRate?: number;
  origin: ProductOrigin;
}

export interface ProductPricing {
  costPrice: number;
  suggestedPrice?: number;
  salePrice: number;
  profitMargin?: number;
  promotionalPrice?: number;
  promotionalPriceStartDate?: Date;
  promotionalPriceEndDate?: Date;
}

export interface ProductUnit {
  baseUnit: UnitType;
  baseQuantity: number;
  fractionalUnit?: UnitType;
  fractionalQuantity?: number;
  conversionFactor?: number;
}

export interface ProductAvailability {
  status: AvailabilityStatus;
  availableStartTime?: string;
  availableEndTime?: string;
  availableDays?: number[];
  seasonalStartDate?: Date;
  seasonalEndDate?: Date;
}

export interface ProductProps {
  id?: string;
  name: string;
  description?: string;
  type: ProductType;
  categoryId: string;
  unit: ProductUnit;
  pricing: ProductPricing;
  taxInfo: ProductTaxInfo;
  availability?: ProductAvailability;
  eanCode?: string;
  internalCode?: string;
  qrCode?: string;
  images?: string[];
  preparationTime?: number;
  minimumStock?: number;
  currentStock?: number;
  stockStatus?: StockStatus;
  expirationDate?: Date;
  batchNumber?: string;
  isActive?: boolean;
  canBeIngredient?: boolean;
  needsRecipe?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product {
  private _id: string;
  private _name: string;
  private _description?: string;
  private _type: ProductType;
  private _categoryId: string;
  private _unit: ProductUnit;
  private _pricing: ProductPricing;
  private _taxInfo: ProductTaxInfo;
  private _availability: ProductAvailability;
  private _eanCode?: string;
  private _internalCode?: string;
  private _qrCode?: string;
  private _images: string[];
  private _preparationTime?: number;
  private _minimumStock?: number;
  private _currentStock: number;
  private _stockStatus: StockStatus;
  private _expirationDate?: Date;
  private _batchNumber?: string;
  private _isActive: boolean;
  private _canBeIngredient: boolean;
  private _needsRecipe: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ProductProps) {
    this._id = props.id || uuidv4();
    this._name = props.name;
    this._description = props.description;
    this._type = props.type;
    this._categoryId = props.categoryId;
    this._unit = props.unit;
    this._pricing = props.pricing;
    this._taxInfo = props.taxInfo;
    this._availability = props.availability || {
      status: AvailabilityStatus.SEMPRE_DISPONIVEL,
    };
    this._eanCode = props.eanCode;
    this._internalCode = props.internalCode;
    this._qrCode = props.qrCode;
    this._images = props.images || [];
    this._preparationTime = props.preparationTime;
    this._minimumStock = props.minimumStock;
    this._currentStock = props.currentStock || 0;
    this._stockStatus = props.stockStatus || StockStatus.DISPONIVEL;
    this._expirationDate = props.expirationDate;
    this._batchNumber = props.batchNumber;
    this._isActive = props.isActive ?? true;
    this._canBeIngredient = props.canBeIngredient ?? true;
    this._needsRecipe = props.needsRecipe ?? false;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();

    this.validate();
    this.updateStockStatus();
  }

  private validate(): void {
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('Nome do produto é obrigatório');
    }

    if (this._name.length > 255) {
      throw new Error('Nome do produto deve ter no máximo 255 caracteres');
    }

    if (!this._categoryId) {
      throw new Error('Categoria é obrigatória');
    }

    if (this._pricing.costPrice < 0) {
      throw new Error('Preço de custo não pode ser negativo');
    }

    if (this._pricing.salePrice < 0) {
      throw new Error('Preço de venda não pode ser negativo');
    }

    if (this._unit.baseQuantity <= 0) {
      throw new Error('Quantidade base deve ser maior que zero');
    }

    if (this._unit.fractionalQuantity && this._unit.fractionalQuantity <= 0) {
      throw new Error('Quantidade fracionária deve ser maior que zero');
    }

    if (this._preparationTime && this._preparationTime < 0) {
      throw new Error('Tempo de preparo não pode ser negativo');
    }

    if (this._minimumStock && this._minimumStock < 0) {
      throw new Error('Estoque mínimo não pode ser negativo');
    }

    if (this._currentStock < 0) {
      throw new Error('Estoque atual não pode ser negativo');
    }
  }

  private updateStockStatus(): void {
    if (this._currentStock === 0) {
      this._stockStatus = StockStatus.ESGOTADO;
    } else if (this._minimumStock && this._currentStock <= this._minimumStock) {
      this._stockStatus = StockStatus.ESTOQUE_BAIXO;
    } else if (this._expirationDate && this._expirationDate < new Date()) {
      this._stockStatus = StockStatus.VENCIDO;
    } else {
      this._stockStatus = StockStatus.DISPONIVEL;
    }
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | undefined {
    return this._description;
  }

  get type(): ProductType {
    return this._type;
  }

  get categoryId(): string {
    return this._categoryId;
  }

  get unit(): ProductUnit {
    return this._unit;
  }

  get pricing(): ProductPricing {
    return this._pricing;
  }

  get taxInfo(): ProductTaxInfo {
    return this._taxInfo;
  }

  get availability(): ProductAvailability {
    return this._availability;
  }

  get eanCode(): string | undefined {
    return this._eanCode;
  }

  get internalCode(): string | undefined {
    return this._internalCode;
  }

  get qrCode(): string | undefined {
    return this._qrCode;
  }

  get images(): string[] {
    return this._images;
  }

  get preparationTime(): number | undefined {
    return this._preparationTime;
  }

  get minimumStock(): number | undefined {
    return this._minimumStock;
  }

  get currentStock(): number {
    return this._currentStock;
  }

  get stockStatus(): StockStatus {
    return this._stockStatus;
  }

  get expirationDate(): Date | undefined {
    return this._expirationDate;
  }

  get batchNumber(): string | undefined {
    return this._batchNumber;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get canBeIngredient(): boolean {
    return this._canBeIngredient;
  }

  get needsRecipe(): boolean {
    return this._needsRecipe;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public updateBasicInfo(name: string, description?: string): void {
    this._name = name;
    this._description = description;
    this._updatedAt = new Date();
    this.validate();
  }

  public updatePricing(pricing: ProductPricing): void {
    this._pricing = pricing;
    this._updatedAt = new Date();
    this.validate();
  }

  public updateTaxInfo(taxInfo: ProductTaxInfo): void {
    this._taxInfo = taxInfo;
    this._updatedAt = new Date();
  }

  public updateAvailability(availability: ProductAvailability): void {
    this._availability = availability;
    this._updatedAt = new Date();
  }

  public addStock(
    quantity: number,
    batchNumber?: string,
    expirationDate?: Date
  ): void {
    if (quantity <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }

    this._currentStock += quantity;
    if (batchNumber) this._batchNumber = batchNumber;
    if (expirationDate) this._expirationDate = expirationDate;
    this._updatedAt = new Date();
    this.updateStockStatus();
  }

  public removeStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }

    if (quantity > this._currentStock) {
      throw new Error('Quantidade insuficiente em estoque');
    }

    this._currentStock -= quantity;
    this._updatedAt = new Date();
    this.updateStockStatus();
  }

  public calculateFractionalPrice(): number {
    if (!this._unit.fractionalQuantity || !this._unit.conversionFactor) {
      return this._pricing.salePrice;
    }

    return (
      (this._pricing.salePrice / this._unit.baseQuantity) *
      this._unit.fractionalQuantity
    );
  }

  public calculateProfitMargin(): number {
    if (this._pricing.costPrice === 0) return 0;
    return (
      ((this._pricing.salePrice - this._pricing.costPrice) /
        this._pricing.costPrice) *
      100
    );
  }

  public isPromotional(): boolean {
    if (!this._pricing.promotionalPrice) return false;

    const now = new Date();
    const startDate = this._pricing.promotionalPriceStartDate;
    const endDate = this._pricing.promotionalPriceEndDate;

    if (startDate && now < startDate) return false;
    if (endDate && now > endDate) return false;

    return true;
  }

  public getCurrentPrice(): number {
    return this.isPromotional()
      ? this._pricing.promotionalPrice!
      : this._pricing.salePrice;
  }

  public isAvailableNow(): boolean {
    const now = new Date();

    if (
      this._availability.status ===
      AvailabilityStatus.TEMPORARIAMENTE_INDISPONIVEL
    ) {
      return false;
    }

    if (this._availability.status === AvailabilityStatus.SAZONAL) {
      const startDate = this._availability.seasonalStartDate;
      const endDate = this._availability.seasonalEndDate;
      if (startDate && endDate) {
        if (now < startDate || now > endDate) return false;
      }
    }

    if (this._availability.status === AvailabilityStatus.DIAS_ESPECIFICOS) {
      const dayOfWeek = now.getDay();
      if (
        this._availability.availableDays &&
        !this._availability.availableDays.includes(dayOfWeek)
      ) {
        return false;
      }
    }

    if (this._availability.status === AvailabilityStatus.HORARIO_ESPECIFICO) {
      const currentTime = now.toTimeString().slice(0, 5);
      const startTime = this._availability.availableStartTime;
      const endTime = this._availability.availableEndTime;
      if (startTime && endTime) {
        if (currentTime < startTime || currentTime > endTime) return false;
      }
    }

    return this._isActive && this._stockStatus !== StockStatus.ESGOTADO;
  }

  public activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  public deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  public addImage(imageUrl: string): void {
    if (!this._images.includes(imageUrl)) {
      this._images.push(imageUrl);
      this._updatedAt = new Date();
    }
  }

  public removeImage(imageUrl: string): void {
    const index = this._images.indexOf(imageUrl);
    if (index > -1) {
      this._images.splice(index, 1);
      this._updatedAt = new Date();
    }
  }

  public isIngredient(): boolean {
    return this._type === ProductType.INSUMO && this._canBeIngredient;
  }

  public isFinalProduct(): boolean {
    return this._type === ProductType.PRODUTO_FINAL;
  }

  public needsLowStockAlert(): boolean {
    return this._stockStatus === StockStatus.ESTOQUE_BAIXO;
  }

  public isExpired(): boolean {
    return this._stockStatus === StockStatus.VENCIDO;
  }
}
