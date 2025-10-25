import { SaleStatus } from '../enums/SaleStatus';

export interface SaleItem {
  productId: string;
  quantity: number;
}

export interface CreateSaleProps {
  items: SaleItem[];
  total: number;
  paymentMethod: string;
  customerId?: string;
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

  constructor(props: CreateSaleProps) {
    this.validateSaleData(props);

    this.items = props.items;
    this.total = props.total;
    this.paymentMethod = props.paymentMethod;
    this.customerId = props.customerId;

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

  private validateSaleData(data: CreateSaleProps): void {
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      throw new Error('Sale must have at least one item');
    }

    if (data.total <= 0) {
      throw new Error('Sale total must be greater than zero');
    }

    if (!data.paymentMethod || data.paymentMethod.trim() === '') {
      throw new Error('Payment method is required');
    }

    for (const item of data.items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        throw new Error(
          'All items must have a valid product ID and positive quantity'
        );
      }
    }
  }
}
