import { v4 as uuidv4 } from 'uuid';

export interface SupplierProps {
  id?: string;
  name: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Supplier {
  private _id: string;
  private _name: string;
  private _cnpj?: string;
  private _email?: string;
  private _phone?: string;
  private _address?: string;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: SupplierProps) {
    this._id = props.id || uuidv4();
    this._name = props.name;
    this._cnpj = props.cnpj;
    this._email = props.email;
    this._phone = props.phone;
    this._address = props.address;
    this._isActive = props.isActive ?? true;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('Nome do fornecedor é obrigatório');
    }

    if (this._name.length > 200) {
      throw new Error('Nome do fornecedor deve ter no máximo 200 caracteres');
    }

    if (this._cnpj && !this.isValidCNPJ(this._cnpj)) {
      throw new Error('CNPJ inválido');
    }

    if (this._email && !this.isValidEmail(this._email)) {
      throw new Error('Email inválido');
    }
  }

  private isValidCNPJ(cnpj: string): boolean {
    return /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(cnpj);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get cnpj(): string | undefined {
    return this._cnpj;
  }

  get email(): string | undefined {
    return this._email;
  }

  get phone(): string | undefined {
    return this._phone;
  }

  get address(): string | undefined {
    return this._address;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public updateInfo(
    name: string,
    cnpj?: string,
    email?: string,
    phone?: string,
    address?: string
  ): void {
    this._name = name;
    this._cnpj = cnpj;
    this._email = email;
    this._phone = phone;
    this._address = address;
    this._updatedAt = new Date();
    this.validate();
  }

  public activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  public deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }
}
