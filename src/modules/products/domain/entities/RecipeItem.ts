import { v4 as uuidv4 } from 'uuid';
import { UnitType } from '../enums/index.js';

export interface RecipeItemProps {
  id?: string;
  recipeId: string;
  ingredientProductId: string;
  quantity: number;
  unit: UnitType;
  cost: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class RecipeItem {
  private _id: string;
  private _recipeId: string;
  private _ingredientProductId: string;
  private _quantity: number;
  private _unit: UnitType;
  private _cost: number;
  private _notes?: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: RecipeItemProps) {
    this._id = props.id || uuidv4();
    this._recipeId = props.recipeId;
    this._ingredientProductId = props.ingredientProductId;
    this._quantity = props.quantity;
    this._unit = props.unit;
    this._cost = props.cost;
    this._notes = props.notes;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this._recipeId) {
      throw new Error('ID da receita é obrigatório');
    }

    if (!this._ingredientProductId) {
      throw new Error('ID do produto ingrediente é obrigatório');
    }

    if (this._quantity <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }

    if (this._cost < 0) {
      throw new Error('Custo não pode ser negativo');
    }
  }

  get id(): string {
    return this._id;
  }

  get recipeId(): string {
    return this._recipeId;
  }

  get ingredientProductId(): string {
    return this._ingredientProductId;
  }

  get quantity(): number {
    return this._quantity;
  }

  get unit(): UnitType {
    return this._unit;
  }

  get cost(): number {
    return this._cost;
  }

  get notes(): string | undefined {
    return this._notes;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public updateQuantity(quantity: number): void {
    this._quantity = quantity;
    this._updatedAt = new Date();
    this.validate();
  }

  public updateCost(cost: number): void {
    this._cost = cost;
    this._updatedAt = new Date();
    this.validate();
  }

  public updateNotes(notes?: string): void {
    this._notes = notes;
    this._updatedAt = new Date();
  }

  public calculateTotalCost(): number {
    return this._quantity * this._cost;
  }
}
