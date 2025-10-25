import { ClientStatus } from '../enums/ClientStatus';

export interface CreateClientProps {
  name: string;
  email: string;
  phone?: string;
  document?: string;
  status?: ClientStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Client {
  private readonly id: string;
  private name: string;
  private email: string;
  private phone?: string;
  private document?: string;
  private status: ClientStatus;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(props: CreateClientProps, id?: string) {
    this.validateClientData(props);

    this.id = id || crypto.randomUUID();
    this.name = props.name;
    this.email = props.email;
    this.phone = props.phone;
    this.document = props.document;
    this.status = props.status || ClientStatus.ACTIVE;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getPhone(): string | undefined {
    return this.phone;
  }

  getDocument(): string | undefined {
    return this.document;
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

  updateInfo(
    data: Partial<Pick<CreateClientProps, 'name' | 'email' | 'phone'>>
  ): void {
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
      this.email = data.email.toLowerCase();
    }

    if (data.phone !== undefined) {
      this.phone = data.phone;
    }

    this.updatedAt = new Date();
  }

  private validateClientData(data: CreateClientProps): void {
    if (!data.name || data.name.trim().length < 2) {
      throw new Error('Client name must have at least 2 characters');
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      throw new Error('Valid email is required');
    }

    if (data.document && data.document.trim().length < 8) {
      throw new Error('Document must have at least 8 characters when provided');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
