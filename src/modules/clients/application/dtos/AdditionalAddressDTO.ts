export interface CreateAdditionalAddressDTO {
  clientId: string;
  address: string;
  addressNumber: string;
  neighborhood: string;
  complement?: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  label: string;
}

export interface AdditionalAddressResponseDTO {
  id: string;
  clientId: string;
  address: string;
  addressNumber: string;
  neighborhood: string;
  complement?: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  label: string;
  isFavorite: boolean;
  usedCount: number;
  lastUsedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  fullAddress: string;
  formattedZipCode: string;
  hasCoordinates: boolean;
}

export interface ClientAddressesResponseDTO {
  primary: {
    address: string;
    addressNumber: string;
    neighborhood: string;
    complement?: string;
    zipCode: string;
    latitude?: number;
    longitude?: number;
    fullAddress: string;
    formattedZipCode: string;
    hasCoordinates: boolean;
  };
  additional: AdditionalAddressResponseDTO[];
}
