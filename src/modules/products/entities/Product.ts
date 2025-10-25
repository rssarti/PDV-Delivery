import { randomUUID } from 'crypto';

export enum ProductCategory {
  ELECTRONICS = 'ELECTRONICS',
  CLOTHING = 'CLOTHING',
  FOOD = 'FOOD',
  BOOKS = 'BOOKS',
  HOME = 'HOME',
}

export class Product {
  id!: string;
  name!: string;
  description?: string;
  price!: number;
  category!: ProductCategory;
  stock!: number;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(props: Omit<Product, 'id'>) {
    this.id = randomUUID();
    Object.assign(this, props);
  }

  updateStock(quantity: number): void {
    if (this.stock + quantity < 0) {
      throw new Error('Insufficient stock');
    }
    this.stock += quantity;
    this.updatedAt = new Date();
  }

  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }
}
