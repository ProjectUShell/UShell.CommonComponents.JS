import { IDataSource } from './iDataSource'

export interface IDataSourceManagerBase {
  tryGetDataSourceByEntityName(entityName: string, storeName?: string): Promise<IDataSource | null>
}
export interface IDataSourceManager extends IDataSourceManagerBase {
  tryGetDataSourceByUid(uid: string): Promise<IDataSource | null>
}
