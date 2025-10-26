import { injectable, inject } from 'inversify';
import { IClientRepository } from '../repositories/IClientRepository';
import { IAdditionalAddressRepository } from '../repositories/IAdditionalAddressRepository';
import { AdditionalAddress } from '../entities/AdditionalAddress';
import { Address } from '../value-objects/Address';
import { CLIENT_TYPES } from '../../types';

@injectable()
export class AddressManagementService {
  constructor(
    @inject(CLIENT_TYPES.ClientRepository)
    private clientRepository: IClientRepository,
    @inject(CLIENT_TYPES.AdditionalAddressRepository)
    private additionalAddressRepository: IAdditionalAddressRepository
  ) {}

  async selectAddressForOrder(
    clientId: string,
    selectedAddress: Address | AdditionalAddress
  ): Promise<void> {
    const client = await this.clientRepository.findById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    if (selectedAddress instanceof AdditionalAddress) {
      selectedAddress.markAsUsed();
      await this.additionalAddressRepository.save(selectedAddress);

      const newPrimaryAddress = this.convertToAddress(selectedAddress);
      client.updatePrimaryAddress(newPrimaryAddress);
      await this.clientRepository.save(client);
    }
  }

  async saveAddressAsAdditional(
    clientId: string,
    address: Address,
    label: string
  ): Promise<AdditionalAddress> {
    const client = await this.clientRepository.findById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    if (this.addressesAreEqual(address, client.getAddress())) {
      throw new Error('This address is already the primary address');
    }

    const existing =
      await this.additionalAddressRepository.findByAddressAndClient(clientId, {
        address: address.getAddress(),
        addressNumber: address.getAddressNumber(),
        neighborhood: address.getNeighborhood(),
        zipCode: address.getZipCode(),
      });

    if (existing) {
      throw new Error('This address already exists in additional addresses');
    }

    const additionalAddress = new AdditionalAddress({
      clientId,
      address: address.getAddress(),
      addressNumber: address.getAddressNumber(),
      neighborhood: address.getNeighborhood(),
      complement: address.getComplement(),
      zipCode: address.getZipCode(),
      latitude: address.getLatitude(),
      longitude: address.getLongitude(),
      label,
      isFavorite: false,
    });

    return await this.additionalAddressRepository.save(additionalAddress);
  }

  async getClientAddresses(clientId: string): Promise<{
    primary: Address;
    additional: AdditionalAddress[];
  }> {
    const client = await this.clientRepository.findById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    const additionalAddresses =
      await this.additionalAddressRepository.findByClientId(clientId);

    return {
      primary: client.getAddress(),
      additional: additionalAddresses,
    };
  }

  async toggleAddressFavorite(addressId: string): Promise<AdditionalAddress> {
    const address = await this.additionalAddressRepository.findById(addressId);
    if (!address) {
      throw new Error('Address not found');
    }

    address.toggleFavorite();
    return await this.additionalAddressRepository.save(address);
  }

  async deleteAdditionalAddress(addressId: string): Promise<void> {
    const address = await this.additionalAddressRepository.findById(addressId);
    if (!address) {
      throw new Error('Address not found');
    }

    await this.additionalAddressRepository.delete(addressId);
  }

  private convertToAddress(additionalAddress: AdditionalAddress): Address {
    return new Address({
      address: additionalAddress.getAddress(),
      addressNumber: additionalAddress.getAddressNumber(),
      neighborhood: additionalAddress.getNeighborhood(),
      complement: additionalAddress.getComplement(),
      zipCode: additionalAddress.getZipCode(),
      latitude: additionalAddress.getLatitude(),
      longitude: additionalAddress.getLongitude(),
    });
  }

  private addressesAreEqual(address1: Address, address2: Address): boolean {
    return (
      address1.getAddress() === address2.getAddress() &&
      address1.getAddressNumber() === address2.getAddressNumber() &&
      address1.getNeighborhood() === address2.getNeighborhood() &&
      address1.getZipCode() === address2.getZipCode()
    );
  }
}
