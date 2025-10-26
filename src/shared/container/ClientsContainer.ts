import { Container } from 'inversify';
import { IClientRepository } from '../../modules/clients/domain/repositories/IClientRepository';
import { IAdditionalAddressRepository } from '../../modules/clients/domain/repositories/IAdditionalAddressRepository';
import { IClientQueryService } from '../domain/services/IClientQueryService';
import { TYPES as CORE_TYPES } from './CoreContainer';
import { TYPES as SALES_TYPES } from './SalesContainer';
import { IDatabaseService } from '../infra/database/services/DatabaseService';
import { TypeORMClientRepository } from '../../modules/clients/infrastructure/repositories/ClientRepository';
import { TypeORMAdditionalAddressRepository } from '../../modules/clients/infrastructure/repositories/TypeORMAdditionalAddressRepository';
import { ClientQueryService } from '../domain/services/implementations/ClientQueryService';
import { CreateClientUseCase } from '../../modules/clients/application/use-cases/create-client/CreateClientUseCase';
import { DeleteClientUseCase } from '../../modules/clients/application/use-cases/delete-client/DeleteClientUseCase';
import { DeactivateClientUseCase } from '../../modules/clients/application/use-cases/deactivate-client/DeactivateClientUseCase';
import { GetClientUseCase } from '../../modules/clients/application/use-cases/get-client/GetClientUseCase';
import { ListClientsUseCase } from '../../modules/clients/application/use-cases/list-clients/ListClientsUseCase';
import { CreateAdditionalAddressUseCase } from '../../modules/clients/application/use-cases/create-additional-address/CreateAdditionalAddressUseCase';
import { ListClientAddressesUseCase } from '../../modules/clients/application/use-cases/list-client-addresses/ListClientAddressesUseCase';
import { ToggleAddressFavoriteUseCase } from '../../modules/clients/application/use-cases/toggle-address-favorite/ToggleAddressFavoriteUseCase';
import { DeleteAdditionalAddressUseCase } from '../../modules/clients/application/use-cases/delete-additional-address/DeleteAdditionalAddressUseCase';
import { SelectAddressForOrderUseCase } from '../../modules/clients/application/use-cases/select-address-for-order/SelectAddressForOrderUseCase';
import { ClientController } from '../../modules/clients/controllers/ClientController';
import { AdditionalAddressController } from '../../modules/clients/controllers/AdditionalAddressController';
import { AddressManagementService } from '../../modules/clients/domain/services/AddressManagementService';
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

  // Register Additional Address Use Cases
  if (!container.isBound(TYPES.CreateAdditionalAddressUseCase)) {
    container
      .bind<CreateAdditionalAddressUseCase>(
        TYPES.CreateAdditionalAddressUseCase
      )
      .to(CreateAdditionalAddressUseCase);
  }

  if (!container.isBound(TYPES.ListClientAddressesUseCase)) {
    container
      .bind<ListClientAddressesUseCase>(TYPES.ListClientAddressesUseCase)
      .to(ListClientAddressesUseCase);
  }

  if (!container.isBound(TYPES.ToggleAddressFavoriteUseCase)) {
    container
      .bind<ToggleAddressFavoriteUseCase>(TYPES.ToggleAddressFavoriteUseCase)
      .to(ToggleAddressFavoriteUseCase);
  }

  if (!container.isBound(TYPES.DeleteAdditionalAddressUseCase)) {
    container
      .bind<DeleteAdditionalAddressUseCase>(
        TYPES.DeleteAdditionalAddressUseCase
      )
      .to(DeleteAdditionalAddressUseCase);
  }

  if (!container.isBound(TYPES.SelectAddressForOrderUseCase)) {
    container
      .bind<SelectAddressForOrderUseCase>(TYPES.SelectAddressForOrderUseCase)
      .to(SelectAddressForOrderUseCase);
  }

  // Register Additional Address Repository
  if (!container.isBound(TYPES.AdditionalAddressRepository)) {
    container
      .bind<IAdditionalAddressRepository>(TYPES.AdditionalAddressRepository)
      .toDynamicValue(() => {
        const databaseService = container.get<IDatabaseService>(
          CORE_TYPES.DatabaseService
        );
        return new TypeORMAdditionalAddressRepository(databaseService);
      });
  }

  // Register Domain Services
  if (!container.isBound(TYPES.AddressManagementService)) {
    container
      .bind<AddressManagementService>(TYPES.AddressManagementService)
      .to(AddressManagementService);
  }

  // Register Controllers
  if (!container.isBound(TYPES.ClientController)) {
    container
      .bind<ClientController>(TYPES.ClientController)
      .to(ClientController);
  }

  if (!container.isBound(TYPES.AdditionalAddressController)) {
    container
      .bind<AdditionalAddressController>(TYPES.AdditionalAddressController)
      .to(AdditionalAddressController);
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
