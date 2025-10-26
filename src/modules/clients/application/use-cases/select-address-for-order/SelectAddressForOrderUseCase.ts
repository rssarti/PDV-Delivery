import { inject, injectable } from 'inversify';
import { AddressManagementService } from '../../../domain/services/AddressManagementService';
import { IAdditionalAddressRepository } from '../../../domain/repositories/IAdditionalAddressRepository';
import { CLIENT_TYPES } from '../../../types';

export interface SelectAddressRequest {
  clientId: string;
  addressId?: string;
  useMainAddress?: boolean;
}

@injectable()
export class SelectAddressForOrderUseCase {
  constructor(
    @inject(CLIENT_TYPES.AddressManagementService)
    private addressManagementService: AddressManagementService,
    @inject(CLIENT_TYPES.AdditionalAddressRepository)
    private additionalAddressRepository: IAdditionalAddressRepository
  ) {}

  async execute(request: SelectAddressRequest): Promise<void> {
    if (request.useMainAddress) {
      return;
    }

    if (!request.addressId) {
      throw new Error('Address ID is required when not using main address');
    }

    const additionalAddress = await this.additionalAddressRepository.findById(
      request.addressId
    );

    if (!additionalAddress) {
      throw new Error('Additional address not found');
    }

    if (additionalAddress.getClientId() !== request.clientId) {
      throw new Error('Address does not belong to this client');
    }

    await this.addressManagementService.selectAddressForOrder(
      request.clientId,
      additionalAddress
    );
  }
}
