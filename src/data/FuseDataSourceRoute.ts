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

export class FuseDataSourceRoute implements IDataSource {
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
    return EntitySchemaService.createNewEntity(this.entitySchema!)
  }
  entityUpdateMethod(entity: any[]): Promise<boolean> {
    return this.dataStore
      .post(
        this.url + `${this.entitySchema!.name}/AddOrUpdateEntity`,
        {
          entity: entity,
        },
        this.entitySchema!,
      )
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
      .post(
        this.url + `${this.entitySchema!.name}/AddOrUpdateEntity`,
        {
          entity: entity,
        },
        this.entitySchema!,
      )
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
      .post(this.url + `${this.entitySchema!.name}/TryDeleteEntities`, {
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
      .post(
        this.url + `${this.entitySchema!.name}/GetEntities`,
        {
          filter: filter,
          limit: pagingParams?.pageSize,
          skip: pagingParams ? (pagingParams?.pageNumber - 1) * pagingParams?.pageSize : 0,
          sortedBy: sortingParams?.map((sp) => (sp.descending ? '^' + sp.fieldName : sp.fieldName)),
        },
        this.entitySchema!,
      )
      .then((r) => {
        return this.dataStore
          .post(this.url + `${this.entitySchema!.name}/Count`, { filter: filter })
          .then((c) => {
            return { page: r.return, total: c.return }
          })
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
      .post(
        this.url + `${this.entitySchema!.name}/GetEntityRefs`,
        {
          filter: filter,
          skip: pagingParams ? (pagingParams.pageNumber - 1) * pagingParams.pageSize : 0,
          limit: pagingParams ? pagingParams.pageSize + 2 : 10,
          sortedBy: sortingParams?.map((sp) => (sp.descending ? '^' + sp.fieldName : sp.fieldName)),
        },
        this.entitySchema!,
      )
      .then((r) => {
        return {
          page: r.return,
          total: 1000,
        }
      })
  }
}
