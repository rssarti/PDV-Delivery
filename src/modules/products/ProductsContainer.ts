import { Container } from 'inversify';
import { PRODUCT_TYPES } from './types';

// Repositories
import { IProductRepository } from './domain/interfaces/IProductRepository';
import { ICategoryRepository } from './domain/interfaces/ICategoryRepository';
import { TypeORMProductRepository } from './infrastructure/repositories/ProductRepository';
import { TypeORMCategoryRepository } from './infrastructure/repositories/CategoryRepository';

// Use Cases
import { CreateProductUseCase } from './application/use-cases/create-product/CreateProductUseCase';
import { UpdateStockUseCase } from './application/use-cases/update-stock/UpdateStockUseCase';
import { CalculateRecipeCostUseCase } from './application/use-cases/calculate-recipe-cost/CalculateRecipeCostUseCase';

// Controllers
import { ProductController } from './infrastructure/controllers/ProductController';

const registerProducts = (container: Container): void => {
  // Repositories
  container
    .bind<IProductRepository>(PRODUCT_TYPES.IProductRepository)
    .to(TypeORMProductRepository)
    .inSingletonScope();

  container
    .bind<ICategoryRepository>(PRODUCT_TYPES.ICategoryRepository)
    .to(TypeORMCategoryRepository)
    .inSingletonScope();

  // Use Cases
  container
    .bind<CreateProductUseCase>(PRODUCT_TYPES.CreateProductUseCase)
    .to(CreateProductUseCase)
    .inSingletonScope();

  container
    .bind<UpdateStockUseCase>(PRODUCT_TYPES.UpdateStockUseCase)
    .to(UpdateStockUseCase)
    .inSingletonScope();

  container
    .bind<CalculateRecipeCostUseCase>(PRODUCT_TYPES.CalculateRecipeCostUseCase)
    .to(CalculateRecipeCostUseCase)
    .inSingletonScope();

  // Controllers
  container
    .bind<ProductController>(PRODUCT_TYPES.ProductController)
    .to(ProductController)
    .inSingletonScope();
};

const TYPES = PRODUCT_TYPES;

export { registerProducts, TYPES };
