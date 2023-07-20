import { IDataSource } from 'ushell-modulebase'
import { FuseConnector } from './FuseConnector'
import { EntitySchema } from 'fusefx-modeldescription'
import { IDataSource2 } from './IDataSource2'

export async function GetFuseDatasource(url: string): Promise<IDataSource2> {
  const entitySchema: EntitySchema = await FuseConnector.getEntitySchema(url)
  const datasource: IDataSource2 = {
    dataSourceUid: '1',
    entitySchema: entitySchema,
    entityFactoryMethod: (entityName: string) => {
      return {}
    },
    entityUpdateMethod: (entityName: string, e: any) => {
      return new Promise<boolean>(() => true)
    },
    entityInsertMethod: (entityName: string, e: any) => {
      return new Promise<boolean>(() => true)
    },
    entityDeleteMethod: (entityName: string, e: any) => {
      return new Promise<boolean>(() => true)
    },
    getRecord(entityName: string) {
      return new Promise<object[]>(() => [])
    },
    getRecords(entityName: string) {
      return FuseConnector.getEntities(url, 'Employee')
    },
  }
  return datasource
}
