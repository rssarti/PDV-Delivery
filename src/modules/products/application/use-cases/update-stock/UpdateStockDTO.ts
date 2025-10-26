export interface UpdateStockDTO {
  productId: string;
  quantity: number;
  operation: 'ADD' | 'REMOVE' | 'SET';
  batchNumber?: string;
  expirationDate?: string;
}
