export interface IDataProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getDataSource(): any;
  runMigrations?(): Promise<void>;
  clearDatabase?(): Promise<void>;
}
