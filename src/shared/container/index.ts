// src/shared/container/index.ts
import { Container } from 'inversify';
import { registerCore, TYPES as CORE_TYPES } from './CoreContainer';
import { registerSales, TYPES as SALES_TYPES } from './SalesContainer';

const container = new Container({ defaultScope: 'Singleton' });

registerCore(container);
registerSales(container);

export const TYPES = { ...CORE_TYPES, ...SALES_TYPES } as const;
export { container };
