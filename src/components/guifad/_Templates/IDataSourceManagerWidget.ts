import { SchemaRoot } from 'fusefx-modeldescription'
import { IDataSource } from 'ushell-modulebase'

export interface IDataSourceManagerWidget {
  tryGetDataSource(entityName: string, storeName?: string): IDataSource | null
  getSchemaRoot(): SchemaRoot
}
