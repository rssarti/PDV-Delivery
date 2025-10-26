import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CategoryEntity } from './CategoryEntity.js';

@Entity('products')
export class ProductEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('varchar', { length: 50 })
  type!: string;

  @Column('uuid')
  categoryId!: string;

  @ManyToOne(() => CategoryEntity)
  @JoinColumn({ name: 'categoryId' })
  category!: CategoryEntity;

  @Column('varchar', { length: 20 })
  baseUnit!: string;

  @Column('decimal', { precision: 10, scale: 3 })
  baseQuantity!: number;

  @Column('varchar', { length: 20, nullable: true })
  fractionalUnit?: string;

  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  fractionalQuantity?: number;

  @Column('decimal', { precision: 10, scale: 6, nullable: true })
  conversionFactor?: number;

  @Column('decimal', { precision: 10, scale: 2 })
  costPrice!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  salePrice!: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  suggestedPrice?: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  profitMargin?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  promotionalPrice?: number;

  @Column('timestamp', { nullable: true })
  promotionalPriceStartDate?: Date;

  @Column('timestamp', { nullable: true })
  promotionalPriceEndDate?: Date;

  @Column('varchar', { length: 20, nullable: true })
  ncm?: string;

  @Column('varchar', { length: 20, nullable: true })
  cest?: string;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  icmsRate?: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  pisRate?: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  cofinsRate?: number;

  @Column('varchar', { length: 50 })
  origin!: string;

  @Column('varchar', { length: 50 })
  availabilityStatus!: string;

  @Column('varchar', { length: 10, nullable: true })
  availableStartTime?: string;

  @Column('varchar', { length: 10, nullable: true })
  availableEndTime?: string;

  @Column('simple-array', { nullable: true })
  availableDays?: number[];

  @Column('date', { nullable: true })
  seasonalStartDate?: Date;

  @Column('date', { nullable: true })
  seasonalEndDate?: Date;

  @Column('varchar', { length: 50, nullable: true })
  eanCode?: string;

  @Column('varchar', { length: 50, nullable: true })
  internalCode?: string;

  @Column('varchar', { length: 255, nullable: true })
  qrCode?: string;

  @Column('simple-array', { nullable: true })
  images?: string[];

  @Column('integer', { nullable: true })
  preparationTime?: number;

  @Column('integer', { nullable: true })
  minimumStock?: number;

  @Column('integer', { default: 0 })
  currentStock!: number;

  @Column('varchar', { length: 50, default: 'DISPONIVEL' })
  stockStatus!: string;

  @Column('date', { nullable: true })
  expirationDate?: Date;

  @Column('varchar', { length: 100, nullable: true })
  batchNumber?: string;

  @Column('boolean', { default: true })
  isActive!: boolean;

  @Column('boolean', { default: true })
  canBeIngredient!: boolean;

  @Column('boolean', { default: false })
  needsRecipe!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
