import { v4 as uuidv4 } from 'uuid';

export interface CategoryProps {
  id?: string;
  name: string;
  description?: string;
  parentCategoryId?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Category {
  private _id: string;
  private _name: string;
  private _description?: string;
  private _parentCategoryId?: string;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: CategoryProps) {
    this._id = props.id || uuidv4();
    this._name = props.name;
    this._description = props.description;
    this._parentCategoryId = props.parentCategoryId;
    this._isActive = props.isActive ?? true;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('Nome da categoria é obrigatório');
    }

    if (this._name.length > 100) {
      throw new Error('Nome da categoria deve ter no máximo 100 caracteres');
    }

    if (this._description && this._description.length > 500) {
      throw new Error(
        'Descrição da categoria deve ter no máximo 500 caracteres'
      );
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

  get parentCategoryId(): string | undefined {
    return this._parentCategoryId;
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

  public updateName(name: string): void {
    this._name = name;
    this._updatedAt = new Date();
    this.validate();
  }

  public updateDescription(description?: string): void {
    this._description = description;
    this._updatedAt = new Date();
    this.validate();
  }

  public activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  public deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  public changeParentCategory(parentCategoryId?: string): void {
    if (parentCategoryId === this._id) {
      throw new Error('Uma categoria não pode ser pai de si mesma');
    }
    this._parentCategoryId = parentCategoryId;
    this._updatedAt = new Date();
  }

  public isSubcategory(): boolean {
    return !!this._parentCategoryId;
  }
}
