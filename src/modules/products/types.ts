export const PRODUCT_TYPES = {
  IProductRepository: Symbol.for('IProductRepository'),
  ICategoryRepository: Symbol.for('ICategoryRepository'),
  ISupplierRepository: Symbol.for('ISupplierRepository'),
  IRecipeRepository: Symbol.for('IRecipeRepository'),

  CreateProductUseCase: Symbol.for('CreateProductUseCase'),
  UpdateProductUseCase: Symbol.for('UpdateProductUseCase'),
  DeleteProductUseCase: Symbol.for('DeleteProductUseCase'),
  GetProductUseCase: Symbol.for('GetProductUseCase'),
  ListProductsUseCase: Symbol.for('ListProductsUseCase'),
  UpdateStockUseCase: Symbol.for('UpdateStockUseCase'),
  CalculateProductCostUseCase: Symbol.for('CalculateProductCostUseCase'),

  CreateCategoryUseCase: Symbol.for('CreateCategoryUseCase'),
  UpdateCategoryUseCase: Symbol.for('UpdateCategoryUseCase'),
  DeleteCategoryUseCase: Symbol.for('DeleteCategoryUseCase'),
  GetCategoryUseCase: Symbol.for('GetCategoryUseCase'),
  ListCategoriesUseCase: Symbol.for('ListCategoriesUseCase'),

  CreateSupplierUseCase: Symbol.for('CreateSupplierUseCase'),
  UpdateSupplierUseCase: Symbol.for('UpdateSupplierUseCase'),
  DeleteSupplierUseCase: Symbol.for('DeleteSupplierUseCase'),
  GetSupplierUseCase: Symbol.for('GetSupplierUseCase'),
  ListSuppliersUseCase: Symbol.for('ListSuppliersUseCase'),

  CreateRecipeUseCase: Symbol.for('CreateRecipeUseCase'),
  UpdateRecipeUseCase: Symbol.for('UpdateRecipeUseCase'),
  DeleteRecipeUseCase: Symbol.for('DeleteRecipeUseCase'),
  GetRecipeUseCase: Symbol.for('GetRecipeUseCase'),
  ListRecipesUseCase: Symbol.for('ListRecipesUseCase'),
  CalculateRecipeCostUseCase: Symbol.for('CalculateRecipeCostUseCase'),

  ProductController: Symbol.for('ProductController'),
  CategoryController: Symbol.for('CategoryController'),
  SupplierController: Symbol.for('SupplierController'),
  RecipeController: Symbol.for('RecipeController'),
} as const;
