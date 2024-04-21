import { EntitySchema } from 'fusefx-modeldescription'
import { LogicalExpression, PagingParams, SortingField, PaginatedList } from 'fusefx-repositorycontract'
import { IDataSource } from 'ushell-modulebase'
import { FuseDataStore } from './FuseDataStore'

export class FuseDataSourceRoute implements IDataSource {
  private url: string

  constructor(url: string, entitySchema: EntitySchema, tokenSourceUid?: string) {
    this.url = url
    this.entitySchema = entitySchema
    this.dataSourceUid = `${this.url}_${this.entitySchema?.name}`
    this.tokenSourceUid = tokenSourceUid ? tokenSourceUid : ''
  }

  dataSourceUid = ''
  tokenSourceUid = ''
  entitySchema?: EntitySchema | undefined
  entityFactoryMethod(): any {
    return {}
  }
  entityUpdateMethod(entity: any[]): Promise<boolean> {
    return FuseDataStore.post(this.tokenSourceUid, this.url + `${this.entitySchema!.name}/AddOrUpdateEntity`, {
      entity: entity,
    }).then((r) => {
      if (r.fault) {
        console.error('AddOrUpdate failed', { entity: entity, fault: r.fault })
      }
      return r.return
    })
  }
  entityInsertMethod(entity: any[]): Promise<boolean> {
    return FuseDataStore.post(this.tokenSourceUid, this.url + `${this.entitySchema!.name}/AddOrUpdateEntity`, {
      entity: entity,
    }).then((r) => {
      if (r.fault) {
        console.error('AddOrUpdate failed', { entity: entity, fault: r.fault })
      }
      return r.return
    })
  }
  entityDeleteMethod(entity: any[]): Promise<boolean> {
    //TODO_RWE
    return FuseDataStore.post(this.tokenSourceUid, this.url + `${this.entitySchema!.name}/DeleteEntities`, {
      idsToDelete: entity,
    }).then((r) => {
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
    return FuseDataStore.post(this.tokenSourceUid, this.url + `${this.entitySchema!.name}/GetEntities`, {
      filter: filter,
      limit: pagingParams?.pageSize,
      skip: pagingParams ? (pagingParams?.pageNumber - 1) * pagingParams?.pageSize : 0,
      sortingParams: sortingParams,
    }).then((r) => {
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
    return FuseDataStore.post(this.tokenSourceUid, this.url + `${this.entitySchema!.name}/GetEntityRefs`, {
      filter: filter,
      skip: pagingParams ? (pagingParams.pageNumber - 1) * pagingParams.pageSize : 0,
      limit: pagingParams ? pagingParams.pageSize + 2 : 10,
      sortingParams: sortingParams,
    }).then((r) => {
      return {
        page: r.return,
        total: 1000,
      }
    })
  }
}
