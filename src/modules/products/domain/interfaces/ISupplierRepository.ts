import { Supplier } from '../entities/Supplier.js';

export interface SupplierFilters {
  isActive?: boolean;
  searchTerm?: string;
}

export interface ISupplierRepository {
  save(supplier: Supplier): Promise<Supplier>;
  findById(id: string): Promise<Supplier | null>;
  findByCnpj(cnpj: string): Promise<Supplier | null>;
  findAll(filters?: SupplierFilters): Promise<Supplier[]>;
  update(id: string, supplier: Partial<Supplier>): Promise<Supplier>;
  delete(id: string): Promise<void>;
  searchByName(name: string): Promise<Supplier[]>;
}
