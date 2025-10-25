import { Container } from 'inversify';
import { IClientRepository } from '../../modules/clients/domain/repositories/IClientRepository';
import { IClientQueryService } from '../domain/services/IClientQueryService';
import { TYPES as CORE_TYPES } from './CoreContainer';
import { TYPES as SALES_TYPES } from './SalesContainer';
import { IDatabaseService } from '../infra/database/services/DatabaseService';
import { TypeORMClientRepository } from '../../modules/clients/infrastructure/repositories/ClientRepository';
import { ClientQueryService } from '../domain/services/implementations/ClientQueryService';
import { CreateClientUseCase } from '../../modules/clients/application/use-cases/create-client/CreateClientUseCase';
import { DeleteClientUseCase } from '../../modules/clients/application/use-cases/delete-client/DeleteClientUseCase';
import { DeactivateClientUseCase } from '../../modules/clients/application/use-cases/deactivate-client/DeactivateClientUseCase';
import { GetClientUseCase } from '../../modules/clients/application/use-cases/get-client/GetClientUseCase';
import { ListClientsUseCase } from '../../modules/clients/application/use-cases/list-clients/ListClientsUseCase';
import { ClientController } from '../../modules/clients/controllers/ClientController';
import { CLIENT_TYPES } from '../../modules/clients/types';

const TYPES = {
  ...CLIENT_TYPES,
  // Shared Services
  ClientQueryService: SALES_TYPES.ClientQueryService, // Reuse the same symbol
};

const registerClients = (container: Container) => {
  // Register Repository Implementation
  if (!container.isBound(TYPES.ClientRepository)) {
    container
      .bind<IClientRepository>(TYPES.ClientRepository)
      .toDynamicValue(() => {
        const databaseService = container.get<IDatabaseService>(
          CORE_TYPES.DatabaseService
        );
        return new TypeORMClientRepository(databaseService);
      });
  }

  // Register Use Cases
  if (!container.isBound(TYPES.CreateClientUseCase)) {
    container
      .bind<CreateClientUseCase>(TYPES.CreateClientUseCase)
      .to(CreateClientUseCase);
  }

  if (!container.isBound(TYPES.DeleteClientUseCase)) {
    container
      .bind<DeleteClientUseCase>(TYPES.DeleteClientUseCase)
      .to(DeleteClientUseCase);
  }

  if (!container.isBound(TYPES.DeactivateClientUseCase)) {
    container
      .bind<DeactivateClientUseCase>(TYPES.DeactivateClientUseCase)
      .to(DeactivateClientUseCase);
  }

  if (!container.isBound(TYPES.GetClientUseCase)) {
    container
      .bind<GetClientUseCase>(TYPES.GetClientUseCase)
      .to(GetClientUseCase);
  }

  if (!container.isBound(TYPES.ListClientsUseCase)) {
    container
      .bind<ListClientsUseCase>(TYPES.ListClientsUseCase)
      .to(ListClientsUseCase);
  }

  // Register Controllers
  if (!container.isBound(TYPES.ClientController)) {
    container
      .bind<ClientController>(TYPES.ClientController)
      .to(ClientController);
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
