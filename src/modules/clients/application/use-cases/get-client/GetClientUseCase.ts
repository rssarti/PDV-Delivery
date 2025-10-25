import { inject, injectable } from 'inversify';
import { IClientRepository } from '../../../domain/repositories/IClientRepository';
import { ClientResponseDTO } from '../../dtos/ClientDTO';
import { CLIENT_TYPES } from '../../../types';

@injectable()
export class GetClientUseCase {
  constructor(
    @inject(CLIENT_TYPES.ClientRepository)
    private clientRepository: IClientRepository
  ) {}

  async execute(clientId: string): Promise<ClientResponseDTO> {
    const client = await this.clientRepository.findById(clientId);

    if (!client) {
      throw new Error('Client not found');
    }

    return this.toResponseDTO(client);
  }

  private toResponseDTO(client: any): ClientResponseDTO {
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
