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
import { FieldPredicate } from 'fusefx-repositorycontract/lib/FieldPredicate'

export class FuseDataSourceBody implements IDataSource {
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
      .post(this.url + `AddOrUpdateEntity`, {
        entityName: this.entitySchema!.name,
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
      .post(this.url + `AddOrUpdateEntity`, {
        entityName: this.entitySchema!.name,
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
    console.debug('delete', entities)
    const idsToDelete: any[] = entities.map((e) =>
      EntitySchemaService.getPrimaryKey(this.entitySchema!, e),
    )
    return this.dataStore
      .post(this.url + `TryDeleteEntities`, {
        entityName: this.entitySchema!.name,
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
      .post(this.url + `GetEntities`, {
        entityName: this.entitySchema!.name,
        filter: filter,
        limit: pagingParams?.pageSize,
        skip: pagingParams ? (pagingParams?.pageNumber - 1) * pagingParams?.pageSize : 0,
        sortedBy: sortingParams?.map((sp) => (sp.descending ? '^' + sp.fieldName : sp.fieldName)),
      })
      .then((r) => {
        return this.dataStore
          .post(this.url + 'Count', { entityName: this.entitySchema!.name, filter: filter })
          .then((c) => {
            return { page: r.return, total: c.return }
          })
      })
  }
  getRecord(identityFields: object): Promise<object> {
    const filter: LogicalExpression = EntitySchemaService.getPrimaryKeyExpression(
      this.entitySchema!,
      identityFields,
    )
    return this.getRecords(filter).then((r) => {
      if (r.total == 0) {
        return null
      }
      return r.page[0]
    })
  }
  getEntityRefs(
    filter?: LogicalExpression | undefined,
    pagingParams?: PagingParams | undefined,
    sortingParams?: SortingField[] | undefined,
  ): Promise<PaginatedList> {
    return this.dataStore
      .post(this.url + `GetEntityRefs`, {
        entityName: this.entitySchema!.name,
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
