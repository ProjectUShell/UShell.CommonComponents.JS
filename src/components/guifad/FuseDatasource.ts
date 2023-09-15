import { IDataSource } from '../../ushell-modulebase/lib/iDataSource'
import { FuseConnector } from '../../data/FuseConnector'
import { EntitySchema } from 'fusefx-modeldescription'
import { PagingParams } from '../../fusefx-repositorycontract/PagingParams'
import { LogicalExpression } from '../../fusefx-repositorycontract/LogicalExpression'
import { SortingField } from '../../fusefx-repositorycontract/SortingField'
import { PaginatedList } from '../../fusefx-repositorycontract/PaginatedList'

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
