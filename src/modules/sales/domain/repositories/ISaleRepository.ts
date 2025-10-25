import { Sale } from '../entities/Sale';

export interface ISaleRepository {
  save(sale: Sale): Promise<Sale>;
  findById(id: string): Promise<Sale | null>;
  findAll(options?: {
    limit?: number;
    offset?: number;
    status?: string;
  }): Promise<Sale[]>;
  cancel(id: string, reason: string): Promise<void>;
  bulkCancel(ids: string[], reason: string): Promise<void>;
}
