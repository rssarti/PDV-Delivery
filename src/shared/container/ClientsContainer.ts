import { Container } from 'inversify';
import { IClientRepository } from '../../modules/clients/domain/repositories/IClientRepository';
import { IClientQueryService } from '../domain/services/IClientQueryService';
import { TYPES as CORE_TYPES } from './CoreContainer';
import { TYPES as SALES_TYPES } from './SalesContainer';
import { DatabaseService } from '../infra/database/services/DatabaseService';
import { TypeORMClientRepository } from '../../modules/clients/infrastructure/repositories/TypeORMClientRepository';
import { ClientQueryService } from '../domain/services/implementations/ClientQueryService';

const TYPES = {
  // Domain Repository Interface
  ClientRepository: Symbol.for('ClientRepository'),
  // Shared Services
  ClientQueryService: SALES_TYPES.ClientQueryService, // Reuse the same symbol
};

const registerClients = (container: Container) => {
  // Register Repository Implementation
  if (!container.isBound(TYPES.ClientRepository)) {
    container
      .bind<IClientRepository>(TYPES.ClientRepository)
      .toDynamicValue(() => {
        const db = container.get<DatabaseService>(CORE_TYPES.DatabaseService);
        return new TypeORMClientRepository(db);
      });
  }

  // Register Shared Services
  if (!container.isBound(TYPES.ClientQueryService)) {
    container
      .bind<IClientQueryService>(TYPES.ClientQueryService)
      .toDynamicValue(() => {
        const repo = container.get<IClientRepository>(TYPES.ClientRepository);
        return new ClientQueryService(repo);
      });
  }
};

export { registerClients, TYPES };
