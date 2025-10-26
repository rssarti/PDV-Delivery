import { injectable, inject } from 'inversify';
import { Repository, DataSource } from 'typeorm';
import {
  ICategoryRepository,
  CategoryFilters,
} from '../../domain/interfaces/ICategoryRepository';
import { Category } from '../../domain/entities/Category';
import { CategoryEntity } from '../../../../shared/infra/database/typeorm/entities/CategoryEntity';
import { TYPES } from '../../../../shared/container/CoreContainer';

@injectable()
export class TypeORMCategoryRepository implements ICategoryRepository {
  private repository: Repository<CategoryEntity>;

  constructor(
    @inject(TYPES.DataSource)
    private dataSource: DataSource
  ) {
    this.repository = this.dataSource.getRepository(CategoryEntity);
  }

  async save(category: Category): Promise<Category> {
    const categoryEntity = this.domainToEntity(category);
    const savedEntity = await this.repository.save(categoryEntity);
    return this.entityToDomain(savedEntity);
  }

  async findById(id: string): Promise<Category | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });
    return entity ? this.entityToDomain(entity) : null;
  }

  async findAll(filters?: CategoryFilters): Promise<Category[]> {
    const queryBuilder = this.repository.createQueryBuilder('category');

    if (filters) {
      if (filters.parentCategoryId !== undefined) {
        if (filters.parentCategoryId === null) {
          queryBuilder.andWhere('category.parentCategoryId IS NULL');
        } else {
          queryBuilder.andWhere(
            'category.parentCategoryId = :parentCategoryId',
            {
              parentCategoryId: filters.parentCategoryId,
            }
          );
        }
      }

      if (filters.isActive !== undefined) {
        queryBuilder.andWhere('category.isActive = :isActive', {
          isActive: filters.isActive,
        });
      }

      if (filters.searchTerm) {
        queryBuilder.andWhere(
          '(category.name ILIKE :searchTerm OR category.description ILIKE :searchTerm)',
          { searchTerm: `%${filters.searchTerm}%` }
        );
      }
    }

    const entities = await queryBuilder.getMany();
    return entities.map(entity => this.entityToDomain(entity));
  }

  async findByParentCategory(parentCategoryId: string): Promise<Category[]> {
    return this.findAll({ parentCategoryId });
  }

  async findRootCategories(): Promise<Category[]> {
    return this.findAll({ parentCategoryId: null });
  }

  async update(id: string, categoryData: Partial<Category>): Promise<Category> {
    const existingCategory = await this.findById(id);
    if (!existingCategory) {
      throw new Error('Categoria não encontrada');
    }

    const updatedEntity = this.domainToEntity(existingCategory);
    Object.assign(updatedEntity, this.domainToEntity(categoryData as Category));
    updatedEntity.id = id;

    const savedEntity = await this.repository.save(updatedEntity);
    return this.entityToDomain(savedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async searchByName(name: string): Promise<Category[]> {
    return this.findAll({ searchTerm: name });
  }

  private domainToEntity(domain: Category): CategoryEntity {
    const entity = new CategoryEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.parentCategoryId = domain.parentCategoryId;
    entity.isActive = domain.isActive;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  private entityToDomain(entity: CategoryEntity): Category {
    return new Category({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      parentCategoryId: entity.parentCategoryId,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
