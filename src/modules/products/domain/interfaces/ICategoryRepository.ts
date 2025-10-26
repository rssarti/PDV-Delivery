import { Category } from '../entities/Category.js';

export interface CategoryFilters {
  parentCategoryId?: string | null;
  isActive?: boolean;
  searchTerm?: string;
}

export interface ICategoryRepository {
  save(category: Category): Promise<Category>;
  findById(id: string): Promise<Category | null>;
  findAll(filters?: CategoryFilters): Promise<Category[]>;
  findByParentCategory(parentCategoryId: string): Promise<Category[]>;
  findRootCategories(): Promise<Category[]>;
  update(id: string, category: Partial<Category>): Promise<Category>;
  delete(id: string): Promise<void>;
  searchByName(name: string): Promise<Category[]>;
}
