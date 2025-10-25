import { DataSource } from 'typeorm';
import { SaleEntity } from './src/shared/infra/database/typeorm/entities/SaleEntity';
import { ProductEntity } from './src/shared/infra/database/typeorm/entities/ProductEntity';
import { CategoryEntity } from './src/shared/infra/database/typeorm/entities/CategoryEntity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'pdv_db',
  entities: [CategoryEntity, ProductEntity, SaleEntity],
  migrations: ['src/shared/infra/database/typeorm/migrations/*.ts'],
  synchronize: false,
  logging: false,
});