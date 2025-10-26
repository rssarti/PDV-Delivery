import { randomUUID } from 'crypto';

export interface CreateAdditionalAddressProps {
  id?: string;
  clientId: string;
  address: string;
  addressNumber: string;
  neighborhood: string;
  complement?: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  label: string;
  isFavorite?: boolean;
}

export class AdditionalAddress {
  private readonly id: string;
  private readonly clientId: string;
  private readonly address: string;
  private readonly addressNumber: string;
  private readonly neighborhood: string;
  private readonly complement?: string;
  private readonly zipCode: string;
  private readonly latitude?: number;
  private readonly longitude?: number;
  private readonly label: string;
  private isFavorite: boolean;
  private usedCount: number;
  private lastUsedAt?: Date;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(props: CreateAdditionalAddressProps) {
    this.id = props.id || randomUUID();
    this.clientId = props.clientId;
    this.address = props.address;
    this.addressNumber = props.addressNumber;
    this.neighborhood = props.neighborhood;
    this.complement = props.complement;
    this.zipCode = props.zipCode;
    this.latitude = props.latitude;
    this.longitude = props.longitude;
    this.label = props.label;
    this.isFavorite = props.isFavorite || false;
    this.usedCount = 0;
    this.lastUsedAt = undefined;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  getId(): string {
    return this.id;
  }

  getClientId(): string {
    return this.clientId;
  }

  getAddress(): string {
    return this.address;
  }

  getAddressNumber(): string {
    return this.addressNumber;
  }

  getNeighborhood(): string {
    return this.neighborhood;
  }

  getComplement(): string | undefined {
    return this.complement;
  }

  getZipCode(): string {
    return this.zipCode;
  }

  getLatitude(): number | undefined {
    return this.latitude;
  }

  getLongitude(): number | undefined {
    return this.longitude;
  }

  getLabel(): string {
    return this.label;
  }

  isFavoriteAddress(): boolean {
    return this.isFavorite;
  }

  getUsedCount(): number {
    return this.usedCount;
  }

  getLastUsedAt(): Date | undefined {
    return this.lastUsedAt;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  markAsUsed(): void {
    this.usedCount += 1;
    this.lastUsedAt = new Date();
    this.updatedAt = new Date();
  }

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
    this.updatedAt = new Date();
  }

  getFullAddress(): string {
    const complement = this.complement ? `, ${this.complement}` : '';
    return `${this.address}, ${this.addressNumber}${complement}, ${this.neighborhood}`;
  }

  getFormattedZipCode(): string {
    return this.zipCode.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  hasCoordinates(): boolean {
    return this.latitude !== undefined && this.longitude !== undefined;
  }
}
