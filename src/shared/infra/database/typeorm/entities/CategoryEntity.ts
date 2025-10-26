import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductEntity } from './ProductEntity.js';

@Entity('categories')
export class CategoryEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('varchar', { length: 100 })
  name!: string;

  @Column('varchar', { length: 500, nullable: true })
  description?: string;

  @Column('uuid', { nullable: true })
  parentCategoryId?: string;

  @Column('text', { nullable: true })
  image?: string;

  @Column('boolean', { default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => ProductEntity, product => product.category)
  products!: ProductEntity[];
}
