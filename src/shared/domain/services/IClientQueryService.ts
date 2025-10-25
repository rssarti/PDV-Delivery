export interface ClientInfo {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}

export interface IClientQueryService {
  findById(id: string): Promise<ClientInfo | null>;
  findByEmail(email: string): Promise<ClientInfo | null>;
  validateClientExists(id: string): Promise<boolean>;
  isClientActive(id: string): Promise<boolean>;
}
