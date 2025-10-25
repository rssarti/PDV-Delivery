import { SaleStatus } from '../enums/SaleStatus';

export interface SaleItem {
  productId: string;
  quantity: number;
}

export class Sale {
  id: string;
  items: SaleItem[];
  total: number;
  paymentMethod: string;
  customerId?: string;
  status: SaleStatus;
  createdAt: Date;
  cancelledAt?: Date;
  cancelReason?: string;

  constructor(props: Omit<Sale, 'id' | 'status' | 'createdAt'>) {
    this.items = props.items;
    this.total = props.total;
    this.paymentMethod = props.paymentMethod;
    this.customerId = props.customerId;
    this.cancelledAt = props.cancelledAt;
    this.cancelReason = props.cancelReason;
    this.id = crypto.randomUUID();
    this.status = SaleStatus.OPEN;
    this.createdAt = new Date();
  }

  cancel(reason: string): void {
    if (this.status === SaleStatus.CANCELLED) {
      throw new Error('Sale is already cancelled');
    }

    this.status = SaleStatus.CANCELLED;
    this.cancelReason = reason;
    this.cancelledAt = new Date();
  }
}
