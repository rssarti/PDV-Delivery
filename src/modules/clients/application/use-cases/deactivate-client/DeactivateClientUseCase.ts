import { inject, injectable } from 'inversify';
import { IClientRepository } from '../../../domain/repositories/IClientRepository';
import { Client } from '../../../domain/entities/Client';
import { ClientResponseDTO } from '../../dtos/ClientDTO';
import { CLIENT_TYPES } from '../../../types';

@injectable()
export class DeactivateClientUseCase {
  constructor(
    @inject(CLIENT_TYPES.ClientRepository)
    private clientRepository: IClientRepository
  ) {}

  async execute(clientId: string): Promise<ClientResponseDTO> {
    const client = await this.clientRepository.findById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    client.deactivate();
    const updatedClient = await this.clientRepository.save(client);
    return this.toResponseDTO(updatedClient);
  }

  private toResponseDTO(client: Client): ClientResponseDTO {
    const address = client.getAddress();

    return {
      id: client.getId(),
      name: client.getName(),
      email: client.getEmail(),
      phone: client.getPhone(),
      address: {
        address: address.getAddress(),
        addressNumber: address.getAddressNumber(),
        neighborhood: address.getNeighborhood(),
        complement: address.getComplement(),
        zipCode: address.getZipCode(),
        latitude: address.getLatitude(),
        longitude: address.getLongitude(),
        fullAddress: address.getFullAddress(),
        formattedZipCode: address.getFormattedZipCode(),
        hasCoordinates: address.hasCoordinates(),
      },
      cpf: client.getCpf(),
      cnpj: client.getCnpj(),
      document: client.getDocument(),
      status: client.getStatus(),
      createdAt: client.getCreatedAt(),
      updatedAt: client.getUpdatedAt(),
      isActive: client.isActive(),
    };
  }
}
