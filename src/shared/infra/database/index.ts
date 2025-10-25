import { IDataProvider } from './providers/IDataProvider';
import { TypeORMProvider } from './providers/TypeORMProvider';

export enum DatabaseType {
  TYPEORM = 'typeorm',
  PRISMA = 'prisma',
}

export class DatabaseProviderFactory {
  static create(type: DatabaseType = DatabaseType.TYPEORM): IDataProvider {
    switch (type) {
      case DatabaseType.TYPEORM:
        return new TypeORMProvider();

      case DatabaseType.PRISMA:
        throw new Error('Prisma provider not implemented yet');

      default:
        throw new Error(`Unsupported database type: ${type}`);
    }
  }

  static createFromEnv(): IDataProvider {
    const dbType =
      (process.env.DATABASE_PROVIDER as DatabaseType) || DatabaseType.TYPEORM;
    return this.create(dbType);
  }
}
