import { inject, injectable } from 'inversify';
import { AddressManagementService } from '../../../domain/services/AddressManagementService';
import { Address } from '../../../domain/value-objects/Address';
import {
  CreateAdditionalAddressDTO,
  AdditionalAddressResponseDTO,
} from '../../dtos/AdditionalAddressDTO';
import { CLIENT_TYPES } from '../../../types';
import { AdditionalAddress } from '../../../domain/entities/AdditionalAddress';

@injectable()
export class CreateAdditionalAddressUseCase {
  constructor(
    @inject(CLIENT_TYPES.AddressManagementService)
    private addressManagementService: AddressManagementService
  ) {}

  async execute(
    data: CreateAdditionalAddressDTO
  ): Promise<AdditionalAddressResponseDTO> {
    const address = new Address({
      address: data.address,
      addressNumber: data.addressNumber,
      neighborhood: data.neighborhood,
      complement: data.complement,
      zipCode: data.zipCode,
      latitude: data.latitude,
      longitude: data.longitude,
    });

    const additionalAddress =
      await this.addressManagementService.saveAddressAsAdditional(
        data.clientId,
        address,
        data.label
      );

    return this.toResponseDTO(additionalAddress);
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
