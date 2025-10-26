import { Router } from 'express';
import { container, TYPES } from '../../container';
import {
  CancelSaleUseCase,
  CreateSaleUseCase,
  GetSaleUseCase,
  ListSalesUseCase,
} from '../../../modules/sales';

const salesRoutes: Router = Router();

salesRoutes.post('/', async (req, res) => {
  try {
    const useCase = container.get<CreateSaleUseCase>(TYPES.CreateSaleUseCase);
    const result = await useCase.execute(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

salesRoutes.get('/', async (req, res) => {
  try {
    const useCase = container.get<ListSalesUseCase>(TYPES.ListSalesUseCase);
    const result = await useCase.execute(req.query);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

salesRoutes.get('/:id', async (req, res) => {
  try {
    const useCase = container.get<GetSaleUseCase>(TYPES.GetSaleUseCase);
    const result = await useCase.execute(req.params.id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

salesRoutes.patch('/:id/cancel', async (req, res) => {
  try {
    const useCase = container.get<CancelSaleUseCase>(TYPES.CancelSaleUseCase);
    const result = await useCase.execute(req.params.id, req.body.reason);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export { salesRoutes };
