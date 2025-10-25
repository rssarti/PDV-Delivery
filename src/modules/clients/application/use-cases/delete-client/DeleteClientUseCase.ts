import { inject, injectable } from 'inversify';
import { IClientRepository } from '../../../domain/repositories/IClientRepository';
import { CLIENT_TYPES } from '../../../types';

@injectable()
export class DeleteClientUseCase {
  constructor(
    @inject(CLIENT_TYPES.ClientRepository)
    private clientRepository: IClientRepository
  ) {}

  async execute(clientId: string): Promise<void> {
    const client = await this.clientRepository.findById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    await this.clientRepository.delete(clientId);
  }
}
