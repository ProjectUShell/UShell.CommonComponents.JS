import { EntitySchema } from 'fusefx-modeldescription'
import {
  LogicalExpression,
  PagingParams,
  SortingField,
  PaginatedList,
} from 'fusefx-repositorycontract'
import { IDataSource } from 'ushell-modulebase'
import { FuseDataStore } from './FuseDataStore'
import { EntitySchemaService } from './EntitySchemaService'

export class FuseDataSourceMethod implements IDataSource {
  private url: string

  constructor(url: string, entitySchema: EntitySchema, dataStore: FuseDataStore) {
    this.url = url
    this.entitySchema = entitySchema
    this.dataSourceUid = `${this.url}_${this.entitySchema?.name}`
    this.dataStore = dataStore
  }

  dataSourceUid = ''
  dataStore: FuseDataStore
  entitySchema?: EntitySchema | undefined
  entityFactoryMethod(): any {
    return {}
  }
  entityUpdateMethod(entity: any[]): Promise<boolean> {
    return this.dataStore
      .post(this.url + `AddOrUpdate${this.entitySchema!.name}`, {
        entity: entity,
      })
      .then((r) => {
        if (r.fault) {
          console.error('AddOrUpdate failed', { entity: entity, fault: r.fault })
          throw r.fault //TODO => fault in signature of IDataSource?
        }
        return r.return
      })
  }
  entityInsertMethod(entity: any[]): Promise<boolean> {
    return this.dataStore
      .post(this.url + `AddOrUpdate${this.entitySchema!.name}`, {
        entity: entity,
      })
      .then((r) => {
        if (r.fault) {
          console.error('AddOrUpdate failed', { entity: entity, fault: r.fault })
        }
        return r.return
      })
  }
  entityDeleteMethod(entities: any[]): Promise<boolean> {
    const idsToDelete: any[] = entities.map((e) =>
      EntitySchemaService.getPrimaryKey(this.entitySchema!, e),
    )
    return this.dataStore
      .post(this.url + `TryDelete${this.entitySchema!.name}List`, {
        keysToDelete: idsToDelete,
      })
      .then((r) => {
        return r
      })
  }
  extractIdentityFrom(entity: object): object {
    throw new Error('Method not implemented.')
  }
  containsIdentityOf(entity: object): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  getRecords(
    filter?: LogicalExpression | undefined,
    pagingParams?: PagingParams | undefined,
    sortingParams?: SortingField[] | undefined,
  ): Promise<PaginatedList> {
    return this.dataStore
      .post(this.url + `Get${this.entitySchema!.name}List`, {
        filter: filter,
        limit: pagingParams?.pageSize,
        skip: pagingParams ? (pagingParams?.pageNumber - 1) * pagingParams?.pageSize : 0,
        sortedBy: sortingParams?.map((sp) => (sp.descending ? '^' + sp.fieldName : sp.fieldName)),
      })
      .then((r) => {
        return { page: r.return, total: 1000 }
      })
  }
  getRecord(identityFields: object): Promise<object> {
    throw new Error('Method not implemented.')
  }
  getEntityRefs(
    filter?: LogicalExpression | undefined,
    pagingParams?: PagingParams | undefined,
    sortingParams?: SortingField[] | undefined,
  ): Promise<PaginatedList> {
    return this.dataStore
      .post(this.url + `Get${this.entitySchema!.name}Refs`, {
        filter: filter,
        skip: pagingParams ? (pagingParams.pageNumber - 1) * pagingParams.pageSize : 0,
        limit: pagingParams ? pagingParams.pageSize + 2 : 10,
        sortedBy: sortingParams?.map((sp) => (sp.descending ? '^' + sp.fieldName : sp.fieldName)),
      })
      .then((r) => {
        return {
          page: r.return,
          total: 1000,
        }
      })
  }
}
