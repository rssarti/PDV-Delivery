// src/shared/container/CoreContainer.ts
import 'reflect-metadata';
import { Container } from 'inversify';
import { DataSource } from 'typeorm';
import { DatabaseProviderFactory } from '../infra/database';
import { DatabaseService } from '../infra/database/services/DatabaseService';

const TYPES = {
  DataSource: Symbol.for('DataSource'),
  DatabaseService: Symbol.for('DatabaseService'),
};

const getInitializedDataSource = (): DataSource => {
  if ((global as any).getDataSource) {
    try {
      const ds = (global as any).getDataSource();
      if (ds.isInitialized) return ds;
    } catch (error) {
      console.error('Error getting global DataSource:', error);
    }
  }

  const provider = DatabaseProviderFactory.createFromEnv();
  const ds = provider.getDataSource();

  if (!ds || !ds.isInitialized) {
    throw new Error('DataSource must be initialized before container creation');
  }

  return ds;
};

const registerCore = (container: Container) => {
  if (!container.isBound(TYPES.DataSource)) {
    container
      .bind<DataSource>(TYPES.DataSource)
      .toDynamicValue(() => getInitializedDataSource())
      .inSingletonScope();
  }

  if (!container.isBound(TYPES.DatabaseService)) {
    container
      .bind<DatabaseService>(TYPES.DatabaseService)
      .toDynamicValue(() => {
        const dataSource = container.get<DataSource>(TYPES.DataSource);
        return new DatabaseService(dataSource);
      })
      .inSingletonScope();
  }
};

export { registerCore, TYPES };
