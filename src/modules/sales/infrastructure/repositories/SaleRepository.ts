import { Sale } from '../../domain/entities/Sale';
import { ISaleRepository } from '../../domain/repositories/ISaleRepository';
import { SaleEntity } from '../../../../shared/infra/database/typeorm/entities/SaleEntity';
import { IDatabaseService } from '../../../../shared/infra/database/services/DatabaseService';

export class TypeORMSaleRepository implements ISaleRepository {
  constructor(private databaseService: IDatabaseService) {}

  async save(sale: Sale): Promise<Sale> {
    const saleEntity = this.domainToEntity(sale);

    const repository = this.databaseService
      .getDataSource()
      .getRepository(SaleEntity);
    const savedEntity = await repository.save(saleEntity);

    return this.entityToDomain(savedEntity);
  }

  async findById(id: string): Promise<Sale | null> {
    const repository = this.databaseService
      .getDataSource()
      .getRepository(SaleEntity);
    const saleEntity = await repository.findOne({ where: { id } });

    if (!saleEntity) {
      return null;
    }

    return this.entityToDomain(saleEntity);
  }

  async findAll(options?: {
    limit?: number;
    offset?: number;
    status?: string;
  }): Promise<Sale[]> {
    const repository = this.databaseService
      .getDataSource()
      .getRepository(SaleEntity);
    const queryBuilder = repository.createQueryBuilder('sale');

    if (options?.status) {
      queryBuilder.where('sale.status = :status', { status: options.status });
    }

    if (options?.limit) {
      queryBuilder.limit(options.limit);
    }

    if (options?.offset) {
      queryBuilder.offset(options.offset);
    }

    const saleEntities = await queryBuilder.getMany();
    return saleEntities.map((entity: SaleEntity) =>
      this.entityToDomain(entity)
    );
  }

  async cancel(id: string, reason: string): Promise<void> {
    const sale = await this.findById(id);
    if (!sale) {
      throw new Error('Sale not found');
    }

    sale.cancel(reason);
    await this.save(sale);
  }

  async bulkCancel(ids: string[], reason: string): Promise<void> {
    for (const id of ids) {
      await this.cancel(id, reason);
    }
  }

  async delete(id: string): Promise<void> {
    const repository = this.databaseService
      .getDataSource()
      .getRepository(SaleEntity);
    await repository.delete(id);
  }

  private domainToEntity(sale: Sale): Partial<SaleEntity> {
    return {
      id: sale.id,
      items: sale.items,
      total: sale.total,
      paymentMethod: sale.paymentMethod,
      customerId: sale.customerId,
      status: sale.status,
      createdAt: sale.createdAt,
      cancelledAt: sale.cancelledAt,
      cancelReason: sale.cancelReason,
    };
  }

  private entityToDomain(entity: SaleEntity): Sale {
    const sale = Object.create(Sale.prototype);
    sale.id = entity.id;
    sale.items = entity.items;
    sale.total = Number(entity.total);
    sale.paymentMethod = entity.paymentMethod;
    sale.customerId = entity.customerId;
    sale.status = entity.status;
    sale.createdAt = entity.createdAt;
    sale.cancelledAt = entity.cancelledAt;
    sale.cancelReason = entity.cancelReason;

    return sale;
  }
}
