import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RecipeEntity } from './RecipeEntity.js';
import { ProductEntity } from './ProductEntity.js';

@Entity('recipe_items')
export class RecipeItemEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  recipeId!: string;

  @ManyToOne(() => RecipeEntity, recipe => recipe.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recipeId' })
  recipe!: RecipeEntity;

  @Column('uuid')
  ingredientProductId!: string;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'ingredientProductId' })
  ingredientProduct!: ProductEntity;

  @Column('decimal', { precision: 10, scale: 3 })
  quantity!: number;

  @Column('varchar', { length: 20 })
  unit!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  cost!: number;

  @Column('text', { nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
