export interface CreateAddressProps {
  address: string;
  addressNumber: string;
  neighborhood: string;
  complement?: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

export class Address {
  private readonly address: string;
  private readonly addressNumber: string;
  private readonly neighborhood: string;
  private readonly complement?: string;
  private readonly zipCode: string;
  private readonly latitude?: number;
  private readonly longitude?: number;

  constructor(props: CreateAddressProps) {
    this.validateAddress(props);

    this.address = props.address.trim();
    this.addressNumber = props.addressNumber.trim();
    this.neighborhood = props.neighborhood.trim();
    this.complement = props.complement?.trim();
    this.zipCode = props.zipCode.replace(/\D/g, '');
    this.latitude = props.latitude;
    this.longitude = props.longitude;
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

  getFullAddress(): string {
    const complement = this.complement ? `, ${this.complement}` : '';
    return `${this.address}, ${this.addressNumber}${complement}, ${this.neighborhood}`;
  }

  hasCoordinates(): boolean {
    return this.latitude !== undefined && this.longitude !== undefined;
  }

  getFormattedZipCode(): string {
    return this.zipCode.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  toJSON(): CreateAddressProps {
    return {
      address: this.address,
      addressNumber: this.addressNumber,
      neighborhood: this.neighborhood,
      complement: this.complement,
      zipCode: this.zipCode,
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }

  static fromJSON(json: CreateAddressProps): Address {
    return new Address(json);
  }

  private validateAddress(props: CreateAddressProps): void {
    if (!props.address || props.address.trim().length < 3) {
      throw new Error('Address must have at least 3 characters');
    }

    if (!props.addressNumber || props.addressNumber.trim().length === 0) {
      throw new Error('Address number is required');
    }

    if (!props.neighborhood || props.neighborhood.trim().length < 2) {
      throw new Error('Neighborhood must have at least 2 characters');
    }

    if (!props.zipCode || props.zipCode.replace(/\D/g, '').length !== 8) {
      throw new Error('ZIP code must have 8 digits');
    }

    if (
      props.latitude !== undefined &&
      (props.latitude < -90 || props.latitude > 90)
    ) {
      throw new Error('Latitude must be between -90 and 90');
    }

    if (
      props.longitude !== undefined &&
      (props.longitude < -180 || props.longitude > 180)
    ) {
      throw new Error('Longitude must be between -180 and 180');
    }
  }
}
