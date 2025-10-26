import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { CreateProductUseCase } from '../../application/use-cases/create-product/CreateProductUseCase';
import { UpdateStockUseCase } from '../../application/use-cases/update-stock/UpdateStockUseCase';
import { IProductRepository } from '../../domain/interfaces/IProductRepository';
import { PRODUCT_TYPES } from '../../types';
import {
  ProductType,
  UnitType,
  ProductOrigin,
  StockStatus,
} from '../../domain/enums/index';

@injectable()
export class ProductController {
  constructor(
    @inject(PRODUCT_TYPES.CreateProductUseCase)
    private createProductUseCase: CreateProductUseCase,
    @inject(PRODUCT_TYPES.UpdateStockUseCase)
    private updateStockUseCase: UpdateStockUseCase,
    @inject(PRODUCT_TYPES.IProductRepository)
    private productRepository: IProductRepository
  ) {}

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        description,
        type,
        categoryId,
        baseUnit,
        baseQuantity,
        fractionalUnit,
        fractionalQuantity,
        conversionFactor,
        costPrice,
        salePrice,
        suggestedPrice,
        ncm,
        cest,
        icmsRate,
        pisRate,
        cofinsRate,
        origin,
        eanCode,
        internalCode,
        images,
        preparationTime,
        minimumStock,
        currentStock,
        canBeIngredient,
        needsRecipe,
      } = req.body;

      const product = await this.createProductUseCase.execute({
        name,
        description,
        type: type as ProductType,
        categoryId,
        baseUnit: baseUnit as UnitType,
        baseQuantity: Number(baseQuantity),
        fractionalUnit: fractionalUnit as UnitType,
        fractionalQuantity: fractionalQuantity
          ? Number(fractionalQuantity)
          : undefined,
        conversionFactor: conversionFactor
          ? Number(conversionFactor)
          : undefined,
        costPrice: Number(costPrice),
        salePrice: Number(salePrice),
        suggestedPrice: suggestedPrice ? Number(suggestedPrice) : undefined,
        ncm,
        cest,
        icmsRate: icmsRate ? Number(icmsRate) : undefined,
        pisRate: pisRate ? Number(pisRate) : undefined,
        cofinsRate: cofinsRate ? Number(cofinsRate) : undefined,
        origin: origin as ProductOrigin,
        eanCode,
        internalCode,
        images,
        preparationTime: preparationTime ? Number(preparationTime) : undefined,
        minimumStock: minimumStock ? Number(minimumStock) : undefined,
        currentStock: currentStock ? Number(currentStock) : undefined,
        canBeIngredient: Boolean(canBeIngredient),
        needsRecipe: Boolean(needsRecipe),
      });

      res.status(201).json({
        success: true,
        data: product,
        message: 'Produto criado com sucesso',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : 'Erro ao criar produto',
      });
    }
  }

  async getProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await this.productRepository.findById(id);

      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Produto não encontrado',
        });
        return;
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : 'Erro ao buscar produto',
      });
    }
  }

  async listProducts(req: Request, res: Response): Promise<void> {
    try {
      const {
        categoryId,
        type,
        stockStatus,
        isActive,
        canBeIngredient,
        needsRecipe,
        minStock,
        maxStock,
        minPrice,
        maxPrice,
        unit,
        searchTerm,
      } = req.query;

      const filters = {
        categoryId: categoryId as string,
        type: type as ProductType,
        stockStatus: stockStatus as StockStatus,
        isActive:
          isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        canBeIngredient:
          canBeIngredient === 'true'
            ? true
            : canBeIngredient === 'false'
              ? false
              : undefined,
        needsRecipe:
          needsRecipe === 'true'
            ? true
            : needsRecipe === 'false'
              ? false
              : undefined,
        minStock: minStock ? Number(minStock) : undefined,
        maxStock: maxStock ? Number(maxStock) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        unit: unit as UnitType,
        searchTerm: searchTerm as string,
      };

      Object.keys(filters).forEach(key => {
        if (filters[key as keyof typeof filters] === undefined) {
          delete filters[key as keyof typeof filters];
        }
      });

      const products = await this.productRepository.findAll(filters);

      res.json({
        success: true,
        data: products,
        total: products.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : 'Erro ao listar produtos',
      });
    }
  }

  async updateStock(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity, operation, batchNumber, expirationDate } = req.body;

      const product = await this.updateStockUseCase.execute({
        productId: id,
        quantity: Number(quantity),
        operation: operation as 'ADD' | 'REMOVE',
        batchNumber,
        expirationDate: expirationDate ? new Date(expirationDate) : undefined,
      });

      res.json({
        success: true,
        data: product,
        message: 'Estoque atualizado com sucesso',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : 'Erro ao atualizar estoque',
      });
    }
  }

  async getIngredients(req: Request, res: Response): Promise<void> {
    try {
      const ingredients = await this.productRepository.findIngredients();

      res.json({
        success: true,
        data: ingredients,
        total: ingredients.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Erro ao buscar ingredientes',
      });
    }
  }

  async getLowStockProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productRepository.findLowStockProducts();

      res.json({
        success: true,
        data: products,
        total: products.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Erro ao buscar produtos com estoque baixo',
      });
    }
  }

  async getExpiredProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productRepository.findExpiredProducts();

      res.json({
        success: true,
        data: products,
        total: products.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Erro ao buscar produtos vencidos',
      });
    }
  }

  async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;

      if (!q) {
        res.status(400).json({
          success: false,
          message: 'Parâmetro de busca é obrigatório',
        });
        return;
      }

      const products = await this.productRepository.searchByName(q as string);

      res.json({
        success: true,
        data: products,
        total: products.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : 'Erro ao buscar produtos',
      });
    }
  }

  async getAvailableProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productRepository.findAvailableNow();

      res.json({
        success: true,
        data: products,
        total: products.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Erro ao buscar produtos disponíveis',
      });
    }
  }
}
