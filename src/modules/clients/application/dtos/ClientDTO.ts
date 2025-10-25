export interface CreateClientDTO {
  name: string;
  email: string;
  phone: string;
  address: {
    address: string;
    addressNumber: string;
    neighborhood: string;
    complement?: string;
    zipCode: string;
    latitude?: number;
    longitude?: number;
  };
  cpf?: string;
  cnpj?: string;
}

export interface UpdateClientDTO {
  name?: string;
  email?: string;
  phone?: string;
  address?: {
    address?: string;
    addressNumber?: string;
    neighborhood?: string;
    complement?: string;
    zipCode?: string;
    latitude?: number;
    longitude?: number;
  };
}

export interface ClientResponseDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
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
  cpf?: string;
  cnpj?: string;
  document?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
