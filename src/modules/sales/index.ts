// Domain
export * from './domain/entities/Sale';
export * from './domain/repositories/ISaleRepository';

// Application Layer
export * from './application';

// Interface Layer
export * from './interfaces/http/controllers/CreateSaleController';
export * from './interfaces/http/controllers/GetSaleController';
export * from './interfaces/http/controllers/ListSalesController';
export * from './interfaces/http/controllers/CancelSaleController';
export * from './interfaces/http/routes/sales.routes';

// Convenient grouped exports
export {
  CreateSaleUseCase,
  GetSaleUseCase,
  ListSalesUseCase,
  CancelSaleUseCase,
} from './application';

export type {
  CreateSaleDTO,
  GetSaleDTO,
  ListSalesDTO,
  CancelSaleDTO,
} from './application';
