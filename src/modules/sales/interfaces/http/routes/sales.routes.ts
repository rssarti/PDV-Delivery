import { Router } from 'express';
import { container, TYPES } from '../../../../../shared/container';
import { CreateSaleUseCase } from '../../../application/use-cases/create-sale/CreateSaleUseCase';
import { GetSaleUseCase } from '../../../application/use-cases/get-sale/GetSaleUseCase';
import { ListSalesUseCase } from '../../../application/use-cases/list-sales/ListSalesUseCase';
import { CancelSaleUseCase } from '../../../application/use-cases/cancel-sale/CancelSaleUseCase';
import { CreateSaleController } from '../controllers/CreateSaleController';
import { GetSaleController } from '../controllers/GetSaleController';
import { ListSalesController } from '../controllers/ListSalesController';
import { CancelSaleController } from '../controllers/CancelSaleController';

const salesRoutes = Router();

salesRoutes.post('/', (req, res) => {
  const useCase = container.get<CreateSaleUseCase>(TYPES.CreateSaleUseCase);
  const controller = new CreateSaleController(useCase);
  return controller.handle(req, res);
});

salesRoutes.get('/', (req, res) => {
  const useCase = container.get<ListSalesUseCase>(TYPES.ListSalesUseCase);
  const controller = new ListSalesController(useCase);
  return controller.handle(req, res);
});

salesRoutes.get('/:id', (req, res) => {
  const useCase = container.get<GetSaleUseCase>(TYPES.GetSaleUseCase);
  const controller = new GetSaleController(useCase);
  return controller.handle(req, res);
});

salesRoutes.patch('/:id/cancel', (req, res) => {
  const useCase = container.get<CancelSaleUseCase>(TYPES.CancelSaleUseCase);
  const controller = new CancelSaleController(useCase);
  return controller.handle(req, res);
});

export { salesRoutes };
