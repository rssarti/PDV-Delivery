import { randomUUID } from 'crypto';
import { ClientStatus } from '../enums/ClientStatus';
import { Address, CreateAddressProps } from '../value-objects/Address';

export interface CreateClientProps {
  name: string;
  email: string;
  phone: string;
  address: CreateAddressProps;
  cpf?: string;
  cnpj?: string;
}

export interface UpdateClientProps {
  name?: string;
  email?: string;
  phone?: string;
  address?: CreateAddressProps;
}

export class Client {
  private readonly id: string;
  private name: string;
  private email: string;
  private phone: string;
  private address: Address;
  private readonly cpf?: string;
  private readonly cnpj?: string;
  private status: ClientStatus;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(props: CreateClientProps, id?: string) {
    this.validateClientData(props);

    this.id = id ?? randomUUID();
    this.name = props.name.trim();
    this.email = props.email.toLowerCase().trim();
    this.phone = props.phone.replace(/\D/g, '');
    this.address = new Address(props.address);
    this.cpf = props.cpf?.replace(/\D/g, '');
    this.cnpj = props.cnpj?.replace(/\D/g, '');
    this.status = ClientStatus.ACTIVE;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getPhone(): string {
    return this.phone;
  }

  getAddress(): Address {
    return this.address;
  }

  getCpf(): string | undefined {
    return this.cpf;
  }

  getCnpj(): string | undefined {
    return this.cnpj;
  }

  getDocument(): string | undefined {
    return this.cpf || this.cnpj;
  }

  getStatus(): ClientStatus {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business Methods
  isActive(): boolean {
    return this.status === ClientStatus.ACTIVE;
  }

  deactivate(): void {
    this.status = ClientStatus.INACTIVE;
    this.updatedAt = new Date();
  }

  suspend(): void {
    this.status = ClientStatus.SUSPENDED;
    this.updatedAt = new Date();
  }

  reactivate(): void {
    this.status = ClientStatus.ACTIVE;
    this.updatedAt = new Date();
  }

  updateInfo(data: UpdateClientProps): void {
    if (data.name) {
      if (!data.name.trim() || data.name.trim().length < 2) {
        throw new Error('Client name must have at least 2 characters');
      }
      this.name = data.name.trim();
    }

    if (data.email) {
      if (!this.isValidEmail(data.email)) {
        throw new Error('Valid email is required');
      }
      this.email = data.email.toLowerCase().trim();
    }

    if (data.phone) {
      this.phone = data.phone.replace(/\D/g, '');
    }

    if (data.address) {
      this.address = new Address(data.address);
    }

    this.updatedAt = new Date();
  }

  updatePrimaryAddress(newAddress: Address): void {
    this.address = newAddress;
    this.updatedAt = new Date();
  }

  private validateClientData(data: CreateClientProps): void {
    if (!data.name || data.name.trim().length < 2) {
      throw new Error('Client name must have at least 2 characters');
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      throw new Error('Valid email is required');
    }

    if (!data.phone || data.phone.trim().length < 10) {
      throw new Error('Phone must have at least 10 digits');
    }

    if (data.cpf && data.cpf.replace(/\D/g, '').length !== 11) {
      throw new Error('CPF must have 11 digits when provided');
    }

    if (data.cnpj && data.cnpj.replace(/\D/g, '').length !== 14) {
      throw new Error('CNPJ must have 14 digits when provided');
    }

    if (!data.cpf && !data.cnpj) {
      throw new Error('Either CPF or CNPJ must be provided');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
