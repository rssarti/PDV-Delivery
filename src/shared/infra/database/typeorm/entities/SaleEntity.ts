import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sales')
export class SaleEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('jsonb')
  items!: { productId: string; quantity: number }[];

  @Column('decimal', { precision: 10, scale: 2 })
  total!: number;

  @Column('varchar')
  paymentMethod!: string;

  @Column('uuid', { nullable: true })
  customerId?: string;

  @Column('varchar')
  status!: string;

  @Column('text', { nullable: true })
  cancelReason?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column('timestamp', { nullable: true })
  cancelledAt?: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
