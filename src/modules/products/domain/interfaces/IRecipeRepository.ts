import { Recipe } from '../entities/Recipe.js';

export interface RecipeFilters {
  productId?: string;
  isActive?: boolean;
  searchTerm?: string;
}

export interface IRecipeRepository {
  save(recipe: Recipe): Promise<Recipe>;
  findById(id: string): Promise<Recipe | null>;
  findByProductId(productId: string): Promise<Recipe | null>;
  findAll(filters?: RecipeFilters): Promise<Recipe[]>;
  update(id: string, recipe: Partial<Recipe>): Promise<Recipe>;
  delete(id: string): Promise<void>;
  searchByName(name: string): Promise<Recipe[]>;
}
