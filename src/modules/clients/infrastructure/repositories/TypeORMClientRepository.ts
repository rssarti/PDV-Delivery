import { IClientRepository } from '../../domain/repositories/IClientRepository';
import { Client } from '../../domain/entities/Client';
import { DatabaseService } from '../../../../shared/infra/database/services/DatabaseService';
import { ClientEntity } from '../../../../shared/infra/database/typeorm/entities/ClientEntity';
import { ClientStatus } from '../../domain/enums/ClientStatus';

export class TypeORMClientRepository implements IClientRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async save(client: Client): Promise<Client> {
    const clientEntity = this.domainToEntity(client);
    const savedEntity = await this.databaseService.entityManager.save(
      ClientEntity,
      clientEntity
    );
    return this.entityToDomain(savedEntity);
  }

  async findById(id: string): Promise<Client | null> {
    const entity = await this.databaseService.entityManager.findOne(
      ClientEntity,
      {
        where: { id },
      }
    );

    return entity ? this.entityToDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const entity = await this.databaseService.entityManager.findOne(
      ClientEntity,
      {
        where: { email },
      }
    );

    return entity ? this.entityToDomain(entity) : null;
  }

  async findByDocument(document: string): Promise<Client | null> {
    const entity = await this.databaseService.entityManager.findOne(
      ClientEntity,
      {
        where: { document },
      }
    );

    return entity ? this.entityToDomain(entity) : null;
  }

  async findAll(options?: {
    limit?: number;
    offset?: number;
    isActive?: boolean;
  }): Promise<Client[]> {
    const queryBuilder = this.databaseService.entityManager
      .createQueryBuilder(ClientEntity, 'client')
      .orderBy('client.created_at', 'DESC');

    if (options?.isActive !== undefined) {
      const status = options.isActive ? 'active' : 'inactive';
      queryBuilder.where('client.status = :status', { status });
    }

    if (options?.limit) {
      queryBuilder.limit(options.limit);
    }

    if (options?.offset) {
      queryBuilder.offset(options.offset);
    }

    const entities = await queryBuilder.getMany();
    return entities.map(entity => this.entityToDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.databaseService.entityManager.delete(ClientEntity, { id });
  }

  private domainToEntity(client: Client): ClientEntity {
    const entity = new ClientEntity();
    entity.id = client.getId();
    entity.name = client.getName();
    entity.email = client.getEmail();
    entity.phone = client.getPhone();
    entity.document = client.getDocument();
    entity.status = client.getStatus();
    entity.created_at = client.getCreatedAt();
    entity.updated_at = client.getUpdatedAt();
    return entity;
  }

  private entityToDomain(entity: ClientEntity): Client {
    return new Client(
      {
        name: entity.name,
        email: entity.email,
        phone: entity.phone,
        document: entity.document,
        status: entity.status as ClientStatus,
        createdAt: entity.created_at,
        updatedAt: entity.updated_at,
      },
      entity.id
    );
  }
}
