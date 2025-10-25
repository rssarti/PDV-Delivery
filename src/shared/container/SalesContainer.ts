import { Container } from 'inversify';
import { CreateSaleUseCase } from '../../modules/sales/application/use-cases/create-sale/CreateSaleUseCase';
import { GetSaleUseCase } from '../../modules/sales/application/use-cases/get-sale/GetSaleUseCase';
import { ListSalesUseCase } from '../../modules/sales/application/use-cases/list-sales/ListSalesUseCase';
import { CancelSaleUseCase } from '../../modules/sales/application/use-cases/cancel-sale/CancelSaleUseCase';
import { TYPES as CORE_TYPES } from './CoreContainer';
import { DatabaseService } from '../infra/database/services/DatabaseService';

const TYPES = {
  CreateSaleUseCase: Symbol.for('CreateSaleUseCase'),
  GetSaleUseCase: Symbol.for('GetSaleUseCase'),
  CancelSaleUseCase: Symbol.for('CancelSaleUseCase'),
  ListSalesUseCase: Symbol.for('ListSalesUseCase'),
  SalesReportUseCase: Symbol.for('SalesReportUseCase'),
  BulkCancelSalesUseCase: Symbol.for('BulkCancelSalesUseCase'),
};

const registerSales = (container: Container) => {
  if (!container.isBound(TYPES.CreateSaleUseCase)) {
    container
      .bind<CreateSaleUseCase>(TYPES.CreateSaleUseCase)
      .toDynamicValue(() => {
        const db = container.get<DatabaseService>(CORE_TYPES.DatabaseService);
        return new CreateSaleUseCase(db);
      });
  }

  if (!container.isBound(TYPES.GetSaleUseCase)) {
    container.bind<GetSaleUseCase>(TYPES.GetSaleUseCase).toDynamicValue(() => {
      const db = container.get<DatabaseService>(CORE_TYPES.DatabaseService);
      return new GetSaleUseCase(db);
    });
  }

  if (!container.isBound(TYPES.CancelSaleUseCase)) {
    container
      .bind<CancelSaleUseCase>(TYPES.CancelSaleUseCase)
      .toDynamicValue(() => {
        const db = container.get<DatabaseService>(CORE_TYPES.DatabaseService);
        return new CancelSaleUseCase(db);
      });
  }

  if (!container.isBound(TYPES.ListSalesUseCase)) {
    container
      .bind<ListSalesUseCase>(TYPES.ListSalesUseCase)
      .toDynamicValue(() => {
        const db = container.get<DatabaseService>(CORE_TYPES.DatabaseService);
        return new ListSalesUseCase(db);
      });
  }
};

export { registerSales, TYPES };
