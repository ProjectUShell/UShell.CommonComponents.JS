import { IDataSource } from 'ushell-modulebase'
import { FuseConnector } from './FuseConnector'
import { EntitySchema } from 'fusefx-modeldescription'
import { IDataSource2 } from './IDataSource2'
import { PagingParams } from 'ushell-modulebase/lib/PagingParams'
import { LogicalExpression } from 'ushell-modulebase/lib/LogicalExpression'
import { SortingField } from 'ushell-modulebase/lib/SortingField'
import { PaginatedList } from 'ushell-modulebase/lib/PaginatedList'

export function GetFuseDatasource(url: string, entitySchema: EntitySchema): IDataSource {
  const datasource: IDataSource = {
    dataSourceUid: '1',
    entitySchema: entitySchema,
    entityFactoryMethod: () => {
      return { id: 0 }
    },
    entityUpdateMethod: (e: any) => {
      return FuseConnector.addOrUpdate(url, entitySchema.name, e)
    },
    entityInsertMethod: (e: any) => {
      return new Promise<boolean>(() => true)
    },
    entityDeleteMethod: (e: any) => {
      return FuseConnector.deleteEntities(url, entitySchema.name, [[e.id]])
    },
    getRecord() {
      return new Promise<object[]>(() => [])
    },
    getRecords(filter?: LogicalExpression, pagingParams?: PagingParams, sortingParams?: SortingField[]) {
      console.log('getting entities', sortingParams)
      return FuseConnector.getEntities(url, entitySchema.name, filter, pagingParams, sortingParams)
    },
    getEntityRefs(
      filter?: LogicalExpression,
      pagingParams?: PagingParams,
      sortingParams?: SortingField[],
    ): Promise<PaginatedList> {
      return FuseConnector.getEntityRefs(url, entitySchema.name, filter, pagingParams, sortingParams)
    },
    extractIdentityFrom: (entity: object) => {
      return {}
    },
    containsIdentityOf: (entity: object) => {
      return new Promise<boolean>(() => true)
    },
  }
  return datasource
}
