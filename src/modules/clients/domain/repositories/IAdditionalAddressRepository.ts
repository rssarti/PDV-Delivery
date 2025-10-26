import { AdditionalAddress } from '../entities/AdditionalAddress';

export interface IAdditionalAddressRepository {
  save(address: AdditionalAddress): Promise<AdditionalAddress>;
  findById(id: string): Promise<AdditionalAddress | null>;
  findByClientId(clientId: string): Promise<AdditionalAddress[]>;
  findByAddressAndClient(
    clientId: string,
    addressData: {
      address: string;
      addressNumber: string;
      neighborhood: string;
      zipCode: string;
    }
  ): Promise<AdditionalAddress | null>;
  delete(id: string): Promise<void>;
  deleteByClientId(clientId: string): Promise<void>;
}
