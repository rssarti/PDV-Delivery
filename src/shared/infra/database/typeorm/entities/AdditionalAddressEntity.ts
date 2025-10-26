import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ClientEntity } from './ClientEntity';

@Entity('additional_addresses')
export class AdditionalAddressEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'client_id', type: 'uuid' })
  clientId!: string;

  @Column({ type: 'varchar' })
  address!: string;

  @Column({ name: 'address_number', type: 'varchar' })
  addressNumber!: string;

  @Column({ type: 'varchar' })
  neighborhood!: string;

  @Column({ type: 'varchar', nullable: true })
  complement?: string;

  @Column({ name: 'zip_code', type: 'varchar' })
  zipCode!: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude?: number;

  @Column({ type: 'varchar' })
  label!: string;

  @Column({ name: 'is_favorite', type: 'boolean', default: false })
  isFavorite!: boolean;

  @Column({ name: 'used_count', type: 'int', default: 0 })
  usedCount!: number;

  @Column({ name: 'last_used_at', type: 'timestamp', nullable: true })
  lastUsedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => ClientEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client!: ClientEntity;
}
