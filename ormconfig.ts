import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'pdv_db',
  entities: ['src/shared/infra/database/typeorm/entities/*.ts'],
  migrations: ['src/shared/infra/database/typeorm/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
