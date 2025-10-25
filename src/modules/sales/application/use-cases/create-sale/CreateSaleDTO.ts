export interface CreateSaleDTO {
  items: { productId: string; quantity: number }[];
  total: number;
  paymentMethod: string;
  customerId?: string;
}
