import { Router } from 'express';
import { salesRoutes } from './sales.routes';

const routes = Router();

routes.use('/sales', salesRoutes);

routes.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    service: 'PDV Backend',
  });
});

export default routes;
