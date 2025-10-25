import { Client } from '../entities/Client';

export interface IClientRepository {
  save(client: Client): Promise<Client>;
  findById(id: string): Promise<Client | null>;
  findByEmail(email: string): Promise<Client | null>;
  findByDocument(document: string): Promise<Client | null>;
  findAll(options?: {
    limit?: number;
    offset?: number;
    isActive?: boolean;
  }): Promise<Client[]>;
  delete(id: string): Promise<void>;
}
