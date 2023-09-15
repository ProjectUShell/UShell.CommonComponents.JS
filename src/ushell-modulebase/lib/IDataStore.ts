import { SchemaRoot } from 'fusefx-modeldescription'
import { IDataSource } from './iDataSource'

export interface IDataStore {
  getSchemaRoot(): Promise<SchemaRoot>
  tryGetDataSource(enityName: string): Promise<IDataSource | null>
}

// FuseStore implementiert IStore und IDataSourceManager

// export class DataStoreDescription {
//   key: string = ''
//   providerClass: 'localstore' | 'fuse' = 'fuse'
//   providerArguments?: any
// }
