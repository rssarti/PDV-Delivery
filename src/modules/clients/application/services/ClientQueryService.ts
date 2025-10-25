import {
  IClientQueryService,
  ClientInfo,
} from '../../../../shared/domain/services/IClientQueryService';
import { IClientRepository } from '../../domain/repositories/IClientRepository';

export class ClientQueryService implements IClientQueryService {
  constructor(private clientRepository: IClientRepository) {}

  async findById(id: string): Promise<ClientInfo | null> {
    const client = await this.clientRepository.findById(id);

    if (!client) {
      return null;
    }

    return {
      id: client.getId(),
      name: client.getName(),
      email: client.getEmail(),
      isActive: client.isActive(),
    };
  }

  async findByEmail(email: string): Promise<ClientInfo | null> {
    const client = await this.clientRepository.findByEmail(email);

    if (!client) {
      return null;
    }

    return {
      id: client.getId(),
      name: client.getName(),
      email: client.getEmail(),
      isActive: client.isActive(),
    };
  }

  async validateClientExists(id: string): Promise<boolean> {
    const client = await this.clientRepository.findById(id);
    return !!client;
  }

  async isClientActive(id: string): Promise<boolean> {
    const client = await this.clientRepository.findById(id);
    return client?.isActive() ?? false;
  }
}
