export const CLIENT_TYPES = {
  ClientRepository: Symbol.for('ClientRepository'),
  // Use Cases
  CreateClientUseCase: Symbol.for('CreateClientUseCase'),
  DeleteClientUseCase: Symbol.for('DeleteClientUseCase'),
  DeactivateClientUseCase: Symbol.for('DeactivateClientUseCase'),
  GetClientUseCase: Symbol.for('GetClientUseCase'),
  ListClientsUseCase: Symbol.for('ListClientsUseCase'),
  // Controllers
  ClientController: Symbol.for('ClientController'),
  // Shared Services
  ClientQueryService: Symbol.for('ClientQueryService'),
};
