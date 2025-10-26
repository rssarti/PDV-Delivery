import { inject, injectable } from 'inversify';
import { AddressManagementService } from '../../../domain/services/AddressManagementService';
import { CLIENT_TYPES } from '../../../types';

@injectable()
export class DeleteAdditionalAddressUseCase {
  constructor(
    @inject(CLIENT_TYPES.AddressManagementService)
    private addressManagementService: AddressManagementService
  ) {}

  async execute(addressId: string): Promise<void> {
    await this.addressManagementService.deleteAdditionalAddress(addressId);
  }
}
