import { inject, injectable } from 'inversify';
import { IClientRepository } from '../../../domain/repositories/IClientRepository';
import { Client, CreateClientProps } from '../../../domain/entities/Client';
import { CreateClientDTO, ClientResponseDTO } from '../../dtos/ClientDTO';
import { CLIENT_TYPES } from '../../../types';

@injectable()
export class CreateClientUseCase {
  constructor(
    @inject(CLIENT_TYPES.ClientRepository)
    private clientRepository: IClientRepository
  ) {}

  async execute(data: CreateClientDTO): Promise<ClientResponseDTO> {
    const existingClientByEmail = await this.clientRepository.findByEmail(
      data.email
    );
    if (existingClientByEmail) {
      throw new Error('Client with this email already exists');
    }

    if (data.cpf) {
      const existingClientByCpf = await this.clientRepository.findByDocument(
        data.cpf
      );
      if (existingClientByCpf) {
        throw new Error('Client with this CPF already exists');
      }
    }

    if (data.cnpj) {
      const existingClientByCnpj = await this.clientRepository.findByDocument(
        data.cnpj
      );
      if (existingClientByCnpj) {
        throw new Error('Client with this CNPJ already exists');
      }
    }

    const clientProps: CreateClientProps = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      cpf: data.cpf,
      cnpj: data.cnpj,
    };

    const client = new Client(clientProps);

    const savedClient = await this.clientRepository.save(client);

    return this.toResponseDTO(savedClient);
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
