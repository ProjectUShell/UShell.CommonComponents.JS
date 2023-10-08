import { IDataSource } from './iDataSource'
import { SchemaRoot } from 'fusefx-modeldescription'

export interface IDataSourceManagerBase {
  tryGetDataSource(entityName: string, storeName?: string): Promise<IDataSource | null>
  getSchemaRoot(): Promise<SchemaRoot>
}
export interface IDataSourceManager extends IDataSourceManagerBase {
  tryGetDataSourceByUid(uid: string): Promise<IDataSource | null>
}
