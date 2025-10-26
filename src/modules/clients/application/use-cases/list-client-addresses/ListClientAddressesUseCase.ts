import { inject, injectable } from 'inversify';
import { AddressManagementService } from '../../../domain/services/AddressManagementService';
import { ClientAddressesResponseDTO } from '../../dtos/AdditionalAddressDTO';
import { CLIENT_TYPES } from '../../../types';

@injectable()
export class ListClientAddressesUseCase {
  constructor(
    @inject(CLIENT_TYPES.AddressManagementService)
    private addressManagementService: AddressManagementService
  ) {}

  async execute(clientId: string): Promise<ClientAddressesResponseDTO> {
    const addresses =
      await this.addressManagementService.getClientAddresses(clientId);

    return {
      primary: {
        address: addresses.primary.getAddress(),
        addressNumber: addresses.primary.getAddressNumber(),
        neighborhood: addresses.primary.getNeighborhood(),
        complement: addresses.primary.getComplement(),
        zipCode: addresses.primary.getZipCode(),
        latitude: addresses.primary.getLatitude(),
        longitude: addresses.primary.getLongitude(),
        fullAddress: addresses.primary.getFullAddress(),
        formattedZipCode: addresses.primary.getFormattedZipCode(),
        hasCoordinates: addresses.primary.hasCoordinates(),
      },
      additional: addresses.additional.map(address => ({
        id: address.getId(),
        clientId: address.getClientId(),
        address: address.getAddress(),
        addressNumber: address.getAddressNumber(),
        neighborhood: address.getNeighborhood(),
        complement: address.getComplement(),
        zipCode: address.getZipCode(),
        latitude: address.getLatitude(),
        longitude: address.getLongitude(),
        label: address.getLabel(),
        isFavorite: address.isFavoriteAddress(),
        usedCount: address.getUsedCount(),
        lastUsedAt: address.getLastUsedAt(),
        createdAt: address.getCreatedAt(),
        updatedAt: address.getUpdatedAt(),
        fullAddress: address.getFullAddress(),
        formattedZipCode: address.getFormattedZipCode(),
        hasCoordinates: address.hasCoordinates(),
      })),
    };
  }
}
