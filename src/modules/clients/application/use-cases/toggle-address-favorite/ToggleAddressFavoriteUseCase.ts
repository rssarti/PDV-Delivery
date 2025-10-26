import { inject, injectable } from 'inversify';
import { AddressManagementService } from '../../../domain/services/AddressManagementService';
import { AdditionalAddressResponseDTO } from '../../dtos/AdditionalAddressDTO';
import { CLIENT_TYPES } from '../../../types';
import { AdditionalAddress } from '../../../domain/entities/AdditionalAddress';

@injectable()
export class ToggleAddressFavoriteUseCase {
  constructor(
    @inject(CLIENT_TYPES.AddressManagementService)
    private addressManagementService: AddressManagementService
  ) {}

  async execute(addressId: string): Promise<AdditionalAddressResponseDTO> {
    const address =
      await this.addressManagementService.toggleAddressFavorite(addressId);

    return this.toResponseDTO(address);
  }

  private toResponseDTO(
    address: AdditionalAddress
  ): AdditionalAddressResponseDTO {
    return {
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
    };
  }
}
