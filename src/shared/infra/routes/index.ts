import { Router } from 'express';
import { salesRoutes } from './sales.routes';
import { clientRoutes } from './client.routes';

const routes: Router = Router();

routes.use('/sales', salesRoutes);
routes.use('/clients', clientRoutes);

routes.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    service: 'PDV Backend',
  });
});

export default routes;
