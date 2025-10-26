import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('suppliers')
export class SupplierEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('varchar', { length: 200 })
  name!: string;

  @Column('varchar', { length: 18, nullable: true })
  cnpj?: string;

  @Column('varchar', { length: 255, nullable: true })
  email?: string;

  @Column('varchar', { length: 20, nullable: true })
  phone?: string;

  @Column('text', { nullable: true })
  address?: string;

  @Column('boolean', { default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
