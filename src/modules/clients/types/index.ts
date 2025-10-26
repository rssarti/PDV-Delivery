export const CLIENT_TYPES = {
  ClientRepository: Symbol.for('ClientRepository'),
  AdditionalAddressRepository: Symbol.for('AdditionalAddressRepository'),
  // Use Cases
  CreateClientUseCase: Symbol.for('CreateClientUseCase'),
  DeleteClientUseCase: Symbol.for('DeleteClientUseCase'),
  DeactivateClientUseCase: Symbol.for('DeactivateClientUseCase'),
  GetClientUseCase: Symbol.for('GetClientUseCase'),
  ListClientsUseCase: Symbol.for('ListClientsUseCase'),
  CreateAdditionalAddressUseCase: Symbol.for('CreateAdditionalAddressUseCase'),
  ListClientAddressesUseCase: Symbol.for('ListClientAddressesUseCase'),
  ToggleAddressFavoriteUseCase: Symbol.for('ToggleAddressFavoriteUseCase'),
  DeleteAdditionalAddressUseCase: Symbol.for('DeleteAdditionalAddressUseCase'),
  SelectAddressForOrderUseCase: Symbol.for('SelectAddressForOrderUseCase'),
  // Controllers
  ClientController: Symbol.for('ClientController'),
  AdditionalAddressController: Symbol.for('AdditionalAddressController'),
  // Shared Services
  ClientQueryService: Symbol.for('ClientQueryService'),
  AddressManagementService: Symbol.for('AddressManagementService'),
};
