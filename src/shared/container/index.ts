// src/shared/container/index.ts
import { Container } from 'inversify';
import { registerCore, TYPES as CORE_TYPES } from './CoreContainer';
import { registerSales, TYPES as SALES_TYPES } from './SalesContainer';
import { registerClients, TYPES as CLIENTS_TYPES } from './ClientsContainer';

const container = new Container({ defaultScope: 'Singleton' });

registerCore(container);
registerClients(container); // Must register clients first since sales depends on it
registerSales(container);

export const TYPES = {
  ...CORE_TYPES,
  ...SALES_TYPES,
  ...CLIENTS_TYPES,
} as const;
export { container };
