import { DataSource } from 'typeorm';
import { IDataProvider } from './IDataProvider';
import { SaleEntity } from '../typeorm/entities/SaleEntity';
import { ProductEntity } from '../typeorm/entities/ProductEntity';
import { CategoryEntity } from '../typeorm/entities/CategoryEntity';
import { ClientEntity } from '../typeorm/entities/ClientEntity';
import { AdditionalAddressEntity } from '../typeorm/entities/AdditionalAddressEntity';
import { SupplierEntity } from '../typeorm/entities/SupplierEntity';
import { RecipeEntity } from '../typeorm/entities/RecipeEntity';
import { RecipeItemEntity } from '../typeorm/entities/RecipeItemEntity';

export class TypeORMProvider implements IDataProvider {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: (process.env.DB_TYPE as any) || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'pdv_db',
      entities: [
        CategoryEntity,
        ProductEntity,
        SaleEntity,
        ClientEntity,
        AdditionalAddressEntity,
        SupplierEntity,
        RecipeEntity,
        RecipeItemEntity,
      ],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
      migrations: ['dist/shared/infra/database/typeorm/migrations/*.js'],
      migrationsTableName: 'typeorm_migrations',
      dropSchema: false,
      migrationsRun: false,
    });
  }

  async connect(): Promise<void> {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
      console.log('🚀 TypeORM connected successfully');
    }
  }

  async disconnect(): Promise<void> {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
      console.log('🔌 TypeORM disconnected');
    }
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }

  async runMigrations(): Promise<void> {
    await this.dataSource.runMigrations();
  }

  async clearDatabase(): Promise<void> {
    const entities = this.dataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = this.dataSource.getRepository(entity.name);
      await repository.clear();
    }
  }
}
