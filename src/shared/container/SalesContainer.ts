import { Container } from 'inversify';
import { CreateSaleUseCase } from '../../modules/sales/application/use-cases/create-sale/CreateSaleUseCase';
import { GetSaleUseCase } from '../../modules/sales/application/use-cases/get-sale/GetSaleUseCase';
import { ListSalesUseCase } from '../../modules/sales/application/use-cases/list-sales/ListSalesUseCase';
import { CancelSaleUseCase } from '../../modules/sales/application/use-cases/cancel-sale/CancelSaleUseCase';
import { ISaleRepository } from '../../modules/sales/domain/repositories/ISaleRepository';
import { TypeORMSaleRepository } from '../../modules/sales/infrastructure/repositories/TypeORMSaleRepository';
import { IClientQueryService } from '../../shared/domain/services/IClientQueryService';
import { TYPES as CORE_TYPES } from './CoreContainer';
import { DatabaseService } from '../infra/database/services/DatabaseService';

const TYPES = {
  // Domain Repository Interface
  SaleRepository: Symbol.for('SaleRepository'),
  // Shared Services
  ClientQueryService: Symbol.for('ClientQueryService'),
  // Application Use Cases
  CreateSaleUseCase: Symbol.for('CreateSaleUseCase'),
  GetSaleUseCase: Symbol.for('GetSaleUseCase'),
  CancelSaleUseCase: Symbol.for('CancelSaleUseCase'),
  ListSalesUseCase: Symbol.for('ListSalesUseCase'),
  SalesReportUseCase: Symbol.for('SalesReportUseCase'),
  BulkCancelSalesUseCase: Symbol.for('BulkCancelSalesUseCase'),
};

const registerSales = (container: Container) => {
  // Register Repository Implementation
  if (!container.isBound(TYPES.SaleRepository)) {
    container.bind<ISaleRepository>(TYPES.SaleRepository).toDynamicValue(() => {
      const db = container.get<DatabaseService>(CORE_TYPES.DatabaseService);
      return new TypeORMSaleRepository(db);
    });
  }

  // Register Use Cases with Dependencies
  if (!container.isBound(TYPES.CreateSaleUseCase)) {
    container
      .bind<CreateSaleUseCase>(TYPES.CreateSaleUseCase)
      .toDynamicValue(() => {
        const repo = container.get<ISaleRepository>(TYPES.SaleRepository);
        const clientService = container.get<IClientQueryService>(
          TYPES.ClientQueryService
        );
        return new CreateSaleUseCase(repo, clientService);
      });
  }

  if (!container.isBound(TYPES.GetSaleUseCase)) {
    container.bind<GetSaleUseCase>(TYPES.GetSaleUseCase).toDynamicValue(() => {
      const repo = container.get<ISaleRepository>(TYPES.SaleRepository);
      return new GetSaleUseCase(repo);
    });
  }

  if (!container.isBound(TYPES.CancelSaleUseCase)) {
    container
      .bind<CancelSaleUseCase>(TYPES.CancelSaleUseCase)
      .toDynamicValue(() => {
        const repo = container.get<ISaleRepository>(TYPES.SaleRepository);
        return new CancelSaleUseCase(repo);
      });
  }

  if (!container.isBound(TYPES.ListSalesUseCase)) {
    container
      .bind<ListSalesUseCase>(TYPES.ListSalesUseCase)
      .toDynamicValue(() => {
        const repo = container.get<ISaleRepository>(TYPES.SaleRepository);
        return new ListSalesUseCase(repo);
      });
  }
};

export { registerSales, TYPES };
