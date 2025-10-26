import { v4 as uuidv4 } from 'uuid';
import { RecipeItem } from './RecipeItem.js';

export interface RecipeProps {
  id?: string;
  productId: string;
  name: string;
  description?: string;
  preparationTime: number;
  yield: number;
  yieldUnit: string;
  instructions?: string;
  totalCost?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Recipe {
  private _id: string;
  private _productId: string;
  private _name: string;
  private _description?: string;
  private _preparationTime: number;
  private _yield: number;
  private _yieldUnit: string;
  private _instructions?: string;
  private _totalCost: number;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _items: RecipeItem[] = [];

  constructor(props: RecipeProps) {
    this._id = props.id || uuidv4();
    this._productId = props.productId;
    this._name = props.name;
    this._description = props.description;
    this._preparationTime = props.preparationTime;
    this._yield = props.yield;
    this._yieldUnit = props.yieldUnit;
    this._instructions = props.instructions;
    this._totalCost = props.totalCost || 0;
    this._isActive = props.isActive ?? true;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this._productId) {
      throw new Error('ID do produto é obrigatório');
    }

    if (!this._name || this._name.trim().length === 0) {
      throw new Error('Nome da receita é obrigatório');
    }

    if (this._name.length > 255) {
      throw new Error('Nome da receita deve ter no máximo 255 caracteres');
    }

    if (this._preparationTime <= 0) {
      throw new Error('Tempo de preparo deve ser maior que zero');
    }

    if (this._yield <= 0) {
      throw new Error('Rendimento deve ser maior que zero');
    }

    if (!this._yieldUnit || this._yieldUnit.trim().length === 0) {
      throw new Error('Unidade de rendimento é obrigatória');
    }
  }

  get id(): string {
    return this._id;
  }

  get productId(): string {
    return this._productId;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | undefined {
    return this._description;
  }

  get preparationTime(): number {
    return this._preparationTime;
  }

  get yield(): number {
    return this._yield;
  }

  get yieldUnit(): string {
    return this._yieldUnit;
  }

  get instructions(): string | undefined {
    return this._instructions;
  }

  get totalCost(): number {
    return this._totalCost;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get items(): RecipeItem[] {
    return [...this._items];
  }

  public updateBasicInfo(name: string, description?: string): void {
    this._name = name;
    this._description = description;
    this._updatedAt = new Date();
    this.validate();
  }

  public updatePreparationInfo(
    preparationTime: number,
    instructions?: string
  ): void {
    this._preparationTime = preparationTime;
    this._instructions = instructions;
    this._updatedAt = new Date();
    this.validate();
  }

  public updateYield(recipeYield: number, yieldUnit: string): void {
    this._yield = recipeYield;
    this._yieldUnit = yieldUnit;
    this._updatedAt = new Date();
    this.validate();
  }

  public addItem(item: RecipeItem): void {
    const existingIndex = this._items.findIndex(
      existingItem =>
        existingItem.ingredientProductId === item.ingredientProductId
    );

    if (existingIndex >= 0) {
      this._items[existingIndex] = item;
    } else {
      this._items.push(item);
    }

    this.calculateTotalCost();
    this._updatedAt = new Date();
  }

  public removeItem(ingredientProductId: string): void {
    const index = this._items.findIndex(
      item => item.ingredientProductId === ingredientProductId
    );

    if (index >= 0) {
      this._items.splice(index, 1);
      this.calculateTotalCost();
      this._updatedAt = new Date();
    }
  }

  public calculateTotalCost(): void {
    this._totalCost = this._items.reduce(
      (total, item) => total + item.calculateTotalCost(),
      0
    );
  }

  public calculateUnitCost(): number {
    return this._totalCost / this._yield;
  }

  public activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  public deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  public hasIngredients(): boolean {
    return this._items.length > 0;
  }

  public getIngredientById(
    ingredientProductId: string
  ): RecipeItem | undefined {
    return this._items.find(
      item => item.ingredientProductId === ingredientProductId
    );
  }

  public getTotalIngredients(): number {
    return this._items.length;
  }

  public estimatePreparationCost(): number {
    return this._totalCost + this.calculateLaborCost();
  }

  private calculateLaborCost(): number {
    const hourlyRate = 15;
    const laborHours = this._preparationTime / 60;
    return laborHours * hourlyRate;
  }
}
