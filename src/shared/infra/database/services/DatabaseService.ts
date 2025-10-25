import { DataSource, EntityManager, Repository } from 'typeorm';
import { SaleEntity } from '../typeorm/entities/SaleEntity';
// import { ProductEntity } from '../typeorm/entities/ProductEntity';
// import { CustomerEntity } from '../typeorm/entities/CustomerEntity';

export interface IDatabaseService {
  entityManager: EntityManager;
  isConnected(): boolean;
  getInfo(): DatabaseInfo;
  getDataSource(): DataSource;

  // 🔄 Transações
  transaction<T>(work: (manager: EntityManager) => Promise<T>): Promise<T>;

  // 📦 Repositories TypeORM nativos (quando necessário)
  getSaleRepository(): Repository<SaleEntity>;
  // getProductRepository(): Repository<ProductEntity>;
  // getCustomerRepository(): Repository<CustomerEntity>;

  // 🎯 Métodos diretos de domínio (mais avançado)
  sales: SalesOperations;
  // products: ProductOperations;
  // customers: CustomerOperations;
}

export class DatabaseService implements IDatabaseService {
  private _entityManager: EntityManager;
  private _sales: SalesOperations;

  constructor(private dataSource: DataSource) {
    if (!dataSource?.isInitialized) {
      throw new Error('DataSource must be initialized');
    }

    this._entityManager = dataSource.manager;
    this._sales = new SalesOperations(this._entityManager);
  }

  get entityManager(): EntityManager {
    return this._entityManager;
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }

  get sales(): SalesOperations {
    return this._sales;
  }

  isConnected(): boolean {
    return this.dataSource?.isInitialized ?? false;
  }

  getInfo(): DatabaseInfo {
    return {
      isConnected: this.isConnected(),
      environment: process.env.NODE_ENV || 'development',
      databaseType: this.dataSource.options.type as string,
      hasEntityManager: true,
      entitiesCount: this.dataSource.entityMetadatas.length,
    };
  }

  /**
   * 🔄 Executa operação em transação
   */
  async transaction<T>(
    work: (manager: EntityManager) => Promise<T>
  ): Promise<T> {
    return await this.dataSource.transaction(work);
  }

  /**
   * 📦 Repositories TypeORM nativos (para casos especiais)
   */
  getSaleRepository(): Repository<SaleEntity> {
    return this._entityManager.getRepository(SaleEntity);
  }

  // getProductRepository(): Repository<ProductEntity> {
  //   return this._entityManager.getRepository(ProductEntity);
  // }

  // getCustomerRepository(): Repository<CustomerEntity> {
  //   return this._entityManager.getRepository(CustomerEntity);
  // }
}

/**
 * 🛒 Sales Operations - Operações avançadas de Sales
 */
export class SalesOperations {
  constructor(private entityManager: EntityManager) {}

  /**
   * 💾 Save sale
   */
  async save(saleData: Partial<SaleEntity>): Promise<SaleEntity> {
    const sale = this.entityManager.create(SaleEntity, saleData);
    return await this.entityManager.save(SaleEntity, sale);
  }

  /**
   * 🔍 Find by ID
   */
  async findById(id: string): Promise<SaleEntity | null> {
    return await this.entityManager.findOne(SaleEntity, { where: { id } });
  }

  /**
   * ❌ Cancel sale
   */
  async cancel(id: string, reason: string): Promise<void> {
    await this.entityManager.update(SaleEntity, id, {
      status: 'CANCELLED',
      cancelReason: reason,
      cancelledAt: new Date(),
    });
  }

  /**
   * � Find all sales
   */
  async findAll(options?: {
    limit?: number;
    offset?: number;
  }): Promise<SaleEntity[]> {
    const query = this.entityManager
      .createQueryBuilder(SaleEntity, 'sale')
      .orderBy('sale.createdAt', 'DESC');

    if (options?.limit) {
      query.limit(options.limit);
    }

    if (options?.offset) {
      query.offset(options.offset);
    }

    return await query.getMany();
  }

  /**
   * 🔍 Find by status
   */
  async findByStatus(status: string): Promise<SaleEntity[]> {
    return await this.entityManager.find(SaleEntity, {
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 📈 Get sales summary
   */
  async getSummary(): Promise<SalesSummary> {
    const result = await this.entityManager
      .createQueryBuilder(SaleEntity, 'sale')
      .select([
        'COUNT(*) as totalSales',
        'SUM(sale.total) as totalAmount',
        'AVG(sale.total) as averageAmount',
        "COUNT(CASE WHEN sale.status = 'OPEN' THEN 1 END) as openSales",
        "COUNT(CASE WHEN sale.status = 'CANCELLED' THEN 1 END) as cancelledSales",
      ])
      .getRawOne();

    return {
      totalSales: parseInt(result.totalSales) || 0,
      totalAmount: parseFloat(result.totalAmount) || 0,
      averageAmount: parseFloat(result.averageAmount) || 0,
      openSales: parseInt(result.openSales) || 0,
      cancelledSales: parseInt(result.cancelledSales) || 0,
    };
  }

  /**
   * 🔄 Bulk operations (transacional)
   */
  async bulkCancel(ids: string[], reason: string): Promise<void> {
    await this.entityManager.update(SaleEntity, ids, {
      status: 'CANCELLED',
      cancelReason: reason,
      cancelledAt: new Date(),
    });
  }

  /**
   * � Custom query example
   */
  async findSalesByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<SaleEntity[]> {
    return await this.entityManager
      .createQueryBuilder(SaleEntity, 'sale')
      .where('sale.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('sale.createdAt', 'DESC')
      .getMany();
  }
}

/**
 * 📋 Interfaces
 */
export interface DatabaseInfo {
  isConnected: boolean;
  environment: string;
  databaseType: string;
  hasEntityManager: boolean;
  entitiesCount: number;
}

export interface SalesSummary {
  totalSales: number;
  totalAmount: number;
  averageAmount: number;
  openSales: number;
  cancelledSales: number;
}
