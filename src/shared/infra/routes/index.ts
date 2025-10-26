import { Router } from 'express';
import { salesRoutes } from './sales.routes';
import { clientRoutes } from './client.routes';
import { additionalAddressRoutes } from './additional-address.routes';
import { productRoutes } from './product.routes';

const routes: Router = Router();

routes.use('/sales', salesRoutes);
routes.use('/clients', clientRoutes);
routes.use('/products', productRoutes);
routes.use('/', additionalAddressRoutes);

routes.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    service: 'PDV Backend',
  });
});

export default routes;
