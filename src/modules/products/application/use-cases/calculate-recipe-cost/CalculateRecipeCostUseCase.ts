import { inject, injectable } from 'inversify';
import { IRecipeRepository } from '../../../domain/interfaces/IRecipeRepository';
import { IProductRepository } from '../../../domain/interfaces/IProductRepository';
import { Recipe } from '../../../domain/entities/index';
import { PRODUCT_TYPES } from '../../../types';

export interface CalculateRecipeCostRequest {
  recipeId: string;
}

export interface RecipeCostResult {
  recipe: Recipe;
  totalCost: number;
  unitCost: number;
  laborCost: number;
  ingredientsCost: number;
  estimatedCost: number;
  profitMargin: number;
  suggestedPrice: number;
}

@injectable()
export class CalculateRecipeCostUseCase {
  constructor(
    @inject(PRODUCT_TYPES.IRecipeRepository)
    private recipeRepository: IRecipeRepository,
    @inject(PRODUCT_TYPES.IProductRepository)
    private productRepository: IProductRepository
  ) {}

  async execute(
    request: CalculateRecipeCostRequest
  ): Promise<RecipeCostResult> {
    const recipe = await this.recipeRepository.findById(request.recipeId);
    if (!recipe) {
      throw new Error('Receita não encontrada');
    }

    let ingredientsCost = 0;

    for (const item of recipe.items) {
      const ingredient = await this.productRepository.findById(
        item.ingredientProductId
      );
      if (ingredient) {
        const ingredientUnitCost =
          ingredient.pricing.costPrice / ingredient.unit.baseQuantity;
        const itemCost = ingredientUnitCost * item.quantity;
        ingredientsCost += itemCost;
      }
    }

    const laborCost = this.calculateLaborCost(recipe.preparationTime);
    const totalCost = ingredientsCost + laborCost;
    const unitCost = totalCost / recipe.yield;
    const estimatedCost = totalCost * 1.1;
    const profitMargin = 0.3;
    const suggestedPrice = unitCost * (1 + profitMargin);

    return {
      recipe,
      totalCost,
      unitCost,
      laborCost,
      ingredientsCost,
      estimatedCost,
      profitMargin: profitMargin * 100,
      suggestedPrice,
    };
  }

  private calculateLaborCost(preparationTimeMinutes: number): number {
    const hourlyRate = 15;
    const laborHours = preparationTimeMinutes / 60;
    return laborHours * hourlyRate;
  }
}
