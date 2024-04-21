import { EntitySchema } from 'fusefx-modeldescription'
import { LogicalExpression, PagingParams, SortingField, PaginatedList } from 'fusefx-repositorycontract'
import { IDataSource } from 'ushell-modulebase'
import { FuseDataStore } from './FuseDataStore'

export class FuseDataSourceBody implements IDataSource {
  private url: string

  constructor(url: string, entitySchema: EntitySchema) {
    this.url = url
    this.entitySchema = entitySchema
  }

  private async post(url: string, bodyParams: any = null): Promise<any> {
    const rawResponse = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: bodyParams ? JSON.stringify(bodyParams) : null,
    })
    const content = await rawResponse.json()

    return content
  }

  dataSourceUid = ''
  entitySchema?: EntitySchema | undefined
  entityFactoryMethod(): any {
    return {}
  }
  entityUpdateMethod(entity: any[]): Promise<boolean> {
    return FuseDataStore.post(this.dataSourceUid, this.url + `AddOrUpdateEntity`, {
      entityName: this.entitySchema!.name,
      entity: entity,
    }).then((r) => {
      if (r.fault) {
        console.error('AddOrUpdate failed', { entity: entity, fault: r.fault })
      }
      return r.return
    })
  }
  entityInsertMethod(entity: any[]): Promise<boolean> {
    return FuseDataStore.post(this.dataSourceUid, this.url + `AddOrUpdateEntity`, {
      entityName: this.entitySchema!.name,
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
    return FuseDataStore.post(this.dataSourceUid, this.url + `DeleteEntities`, {
      entityName: this.entitySchema!.name,
      idsToDelete: entity,
    }).then((r) => {
      console.log('res del', r)
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
    return FuseDataStore.post(this.dataSourceUid, this.url + `GetEntities`, {
      entityName: this.entitySchema!.name,
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
    return FuseDataStore.post(this.dataSourceUid, this.url + `GetEntityRefs`, {
      entityName: this.entitySchema!.name,
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
