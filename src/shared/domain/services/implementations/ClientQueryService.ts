import { IClientQueryService, ClientInfo } from '../IClientQueryService';
import { IClientRepository } from '../../../../modules/clients/domain/repositories/IClientRepository';
import { ClientStatus } from '../../../../modules/clients/domain/enums/ClientStatus';

export class ClientQueryService implements IClientQueryService {
  constructor(private readonly clientRepository: IClientRepository) {}

  async findById(id: string): Promise<ClientInfo | null> {
    const client = await this.clientRepository.findById(id);
    if (!client) return null;

    return {
      id: client.getId(),
      name: client.getName(),
      email: client.getEmail(),
      isActive: client.getStatus() === ClientStatus.ACTIVE,
    };
  }

  async findByEmail(email: string): Promise<ClientInfo | null> {
    const client = await this.clientRepository.findByEmail(email);
    if (!client) return null;

    return {
      id: client.getId(),
      name: client.getName(),
      email: client.getEmail(),
      isActive: client.getStatus() === ClientStatus.ACTIVE,
    };
  }

  async validateClientExists(id: string): Promise<boolean> {
    const client = await this.clientRepository.findById(id);
    return client !== null;
  }

  async isClientActive(id: string): Promise<boolean> {
    const client = await this.clientRepository.findById(id);
    return client !== null && client.getStatus() === ClientStatus.ACTIVE;
  }
}
