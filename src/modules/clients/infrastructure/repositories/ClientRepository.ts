import { inject, injectable } from 'inversify';
import { IClientRepository } from '../../domain/repositories/IClientRepository';
import { Client } from '../../domain/entities/Client';
import { ClientEntity } from '../../../../shared/infra/database/typeorm/entities/ClientEntity';
import { IDatabaseService } from '../../../../shared/infra/database/services/DatabaseService';
import { ClientStatus } from '../../domain/enums/ClientStatus';

@injectable()
export class TypeORMClientRepository implements IClientRepository {
  constructor(
    @inject('DatabaseService') private databaseService: IDatabaseService
  ) {}

  async save(client: Client): Promise<Client> {
    const repository = this.databaseService
      .getDataSource()
      .getRepository(ClientEntity);
    const clientEntity = this.domainToEntity(client);

    await repository.save(clientEntity);
    return client;
  }

  async findById(id: string): Promise<Client | null> {
    const repository = this.databaseService
      .getDataSource()
      .getRepository(ClientEntity);
    const clientEntity = await repository.findOne({
      where: { id },
    });

    if (!clientEntity) {
      return null;
    }

    return this.entityToDomain(clientEntity);
  }

  async findByEmail(email: string): Promise<Client | null> {
    const repository = this.databaseService
      .getDataSource()
      .getRepository(ClientEntity);
    const clientEntity = await repository.findOne({
      where: { email },
    });

    if (!clientEntity) {
      return null;
    }

    return this.entityToDomain(clientEntity);
  }

  async findByDocument(document: string): Promise<Client | null> {
    const repository = this.databaseService
      .getDataSource()
      .getRepository(ClientEntity);
    const clientEntity = await repository.findOne({
      where: [
        { cpf: document.replace(/\D/g, '') },
        { cnpj: document.replace(/\D/g, '') },
      ],
    });

    if (!clientEntity) {
      return null;
    }

    return this.entityToDomain(clientEntity);
  }

  async findAll(): Promise<Client[]> {
    const repository = this.databaseService
      .getDataSource()
      .getRepository(ClientEntity);
    const clientEntities = await repository.find();

    return clientEntities.map((entity: ClientEntity) =>
      this.entityToDomain(entity)
    );
  }

  async delete(id: string): Promise<void> {
    const repository = this.databaseService
      .getDataSource()
      .getRepository(ClientEntity);
    const data = await repository.findOne({ where: { id } });
    data!.status = ClientStatus.INACTIVE;
    data!.deleted_at = new Date();
    await repository.save(data!);
  }

  private domainToEntity(client: Client): ClientEntity {
    const entity = new ClientEntity();

    entity.id = client.getId();
    entity.name = client.getName();
    entity.email = client.getEmail();
    entity.phone = client.getPhone();
    entity.address = client.getAddress().toJSON();
    entity.cpf = client.getCpf();
    entity.cnpj = client.getCnpj();
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
        address: entity.address,
        cpf: entity.cpf,
        cnpj: entity.cnpj,
      },
      entity.id
    );
  }
}
