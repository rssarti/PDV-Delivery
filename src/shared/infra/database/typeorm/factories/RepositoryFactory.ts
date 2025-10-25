import { DataSource, EntityTarget, Repository, ObjectLiteral } from 'typeorm';

export class RepositoryFactory {
  static createRepository<T extends ObjectLiteral>(
    entity: EntityTarget<T>,
    dataSource?: DataSource
  ): Repository<T> {
    if (!dataSource) {
      throw new Error('DataSource is required to create TypeORM Repository');
    }

    console.log(
      `🗄️ [REPOSITORY] Creating repository for entity: ${entity.toString()}`
    );
    return dataSource.getRepository<T>(entity);
  }
}
