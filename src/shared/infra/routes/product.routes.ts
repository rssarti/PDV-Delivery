import { Router } from 'express';
import { container } from '../../container/index';
import { ProductController } from '../../../modules/products/infrastructure/controllers/ProductController';
import { PRODUCT_TYPES } from '../../../modules/products/types';

const productRoutes: Router = Router();

const getProductController = (): ProductController => {
  return container.get<ProductController>(PRODUCT_TYPES.ProductController);
};

// Rotas de produtos
productRoutes.post('/', async (req, res) => {
  const controller = getProductController();
  await controller.createProduct(req, res);
});

productRoutes.get('/', async (req, res) => {
  const controller = getProductController();
  await controller.listProducts(req, res);
});

productRoutes.get('/search', async (req, res) => {
  const controller = getProductController();
  await controller.searchProducts(req, res);
});

productRoutes.get('/ingredients', async (req, res) => {
  const controller = getProductController();
  await controller.getIngredients(req, res);
});

productRoutes.get('/low-stock', async (req, res) => {
  const controller = getProductController();
  await controller.getLowStockProducts(req, res);
});

productRoutes.get('/expired', async (req, res) => {
  const controller = getProductController();
  await controller.getExpiredProducts(req, res);
});

productRoutes.get('/available', async (req, res) => {
  const controller = getProductController();
  await controller.getAvailableProducts(req, res);
});

productRoutes.get('/:id', async (req, res) => {
  const controller = getProductController();
  await controller.getProduct(req, res);
});

productRoutes.patch('/:id/stock', async (req, res) => {
  const controller = getProductController();
  await controller.updateStock(req, res);
});

export { productRoutes };
