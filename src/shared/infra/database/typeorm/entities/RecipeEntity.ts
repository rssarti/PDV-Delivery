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
import { ProductEntity } from './ProductEntity.js';
import { RecipeItemEntity } from './RecipeItemEntity.js';

@Entity('recipes')
export class RecipeEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  productId!: string;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'productId' })
  product!: ProductEntity;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('integer')
  preparationTime!: number;

  @Column('decimal', { precision: 10, scale: 3 })
  yield!: number;

  @Column('varchar', { length: 50 })
  yieldUnit!: string;

  @Column('text', { nullable: true })
  instructions?: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalCost!: number;

  @Column('boolean', { default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => RecipeItemEntity, item => item.recipe, { cascade: true })
  items!: RecipeItemEntity[];
}
