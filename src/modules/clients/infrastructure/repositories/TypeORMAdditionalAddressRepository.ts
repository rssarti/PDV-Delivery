import { Repository } from 'typeorm';
import { injectable } from 'inversify';
import { IAdditionalAddressRepository } from '../../domain/repositories/IAdditionalAddressRepository';
import { AdditionalAddress } from '../../domain/entities/AdditionalAddress';
import { AdditionalAddressEntity } from '../../../../shared/infra/database/typeorm/entities/AdditionalAddressEntity';
import { IDatabaseService } from '../../../../shared/infra/database/services/DatabaseService';

@injectable()
export class TypeORMAdditionalAddressRepository
  implements IAdditionalAddressRepository
{
  private repository: Repository<AdditionalAddressEntity>;

  constructor(private databaseService: IDatabaseService) {
    const dataSource = this.databaseService.getDataSource();
    this.repository = dataSource.getRepository(AdditionalAddressEntity);
  }

  async save(address: AdditionalAddress): Promise<AdditionalAddress> {
    const entity = this.domainToEntity(address);
    const savedEntity = await this.repository.save(entity);
    return this.entityToDomain(savedEntity);
  }

  async findById(id: string): Promise<AdditionalAddress | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.entityToDomain(entity) : null;
  }

  async findByClientId(clientId: string): Promise<AdditionalAddress[]> {
    const entities = await this.repository.find({
      where: { clientId },
      order: { lastUsedAt: 'DESC', createdAt: 'DESC' },
    });
    return entities.map(entity => this.entityToDomain(entity));
  }

  async findByAddressAndClient(
    clientId: string,
    addressData: {
      address: string;
      addressNumber: string;
      neighborhood: string;
      zipCode: string;
    }
  ): Promise<AdditionalAddress | null> {
    const entity = await this.repository.findOne({
      where: {
        clientId,
        address: addressData.address,
        addressNumber: addressData.addressNumber,
        neighborhood: addressData.neighborhood,
        zipCode: addressData.zipCode,
      },
    });
    return entity ? this.entityToDomain(entity) : null;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByClientId(clientId: string): Promise<void> {
    await this.repository.delete({ clientId });
  }

  private domainToEntity(domain: AdditionalAddress): AdditionalAddressEntity {
    const entity = new AdditionalAddressEntity();
    entity.id = domain.getId();
    entity.clientId = domain.getClientId();
    entity.address = domain.getAddress();
    entity.addressNumber = domain.getAddressNumber();
    entity.neighborhood = domain.getNeighborhood();
    entity.complement = domain.getComplement();
    entity.zipCode = domain.getZipCode();
    entity.latitude = domain.getLatitude();
    entity.longitude = domain.getLongitude();
    entity.label = domain.getLabel();
    entity.isFavorite = domain.isFavoriteAddress();
    entity.usedCount = domain.getUsedCount();
    entity.lastUsedAt = domain.getLastUsedAt();
    entity.createdAt = domain.getCreatedAt();
    entity.updatedAt = domain.getUpdatedAt();
    return entity;
  }

  private entityToDomain(entity: AdditionalAddressEntity): AdditionalAddress {
    const address = new AdditionalAddress({
      id: entity.id,
      clientId: entity.clientId,
      address: entity.address,
      addressNumber: entity.addressNumber,
      neighborhood: entity.neighborhood,
      complement: entity.complement,
      zipCode: entity.zipCode,
      latitude: entity.latitude,
      longitude: entity.longitude,
      label: entity.label,
      isFavorite: entity.isFavorite,
    });

    if (entity.usedCount > 0) {
      for (let i = 0; i < entity.usedCount; i++) {
        address.markAsUsed();
      }
    }

    return address;
  }
}
