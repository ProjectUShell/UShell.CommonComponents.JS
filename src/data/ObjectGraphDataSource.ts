import { EntitySchema } from 'fusefx-modeldescription'
import { matchOnPrimaryKeyIndex } from 'fusefx-modeldescription/lib/utils'
import {
  LogicalExpression,
  PagingParams,
  SortingField,
  PaginatedList,
} from 'fusefx-repositorycontract'
import { IDataSource } from 'ushell-modulebase'

export class ObjectGraphDataSource implements IDataSource {
  dataSourceUid: string = crypto.randomUUID()
  entitySchema: EntitySchema

  private objectGraph: any
  private propertyPath: string
  constructor(entitySchema: EntitySchema, objectGraph: any, propertyPath: string) {
    this.entitySchema = entitySchema
    this.objectGraph = objectGraph
    this.propertyPath = propertyPath
  }

  entityFactoryMethod() {
    return {}
  }
  entityUpdateMethod(entity: any[]) {
    console.log('updating', entity)
    return new Promise<boolean>((res) => {
      const existingEntityIndex: number = this.objectGraph[this.propertyPath].findIndex((e: any) =>
        matchOnPrimaryKeyIndex(e, entity, this.entitySchema),
      )
      if (existingEntityIndex >= 0) {
        this.objectGraph[this.propertyPath][existingEntityIndex] = entity
      } else {
        this.objectGraph[this.propertyPath].push(entity)
      }
      return res(true)
    })
  }
  entityInsertMethod(entity: any[]) {
    console.log('inserting', entity)
    return new Promise<boolean>((res) => {
      this.objectGraph[this.propertyPath].push(entity)
      return res(true)
    })
  }
  entityDeleteMethod(entity: any[]) {
    return new Promise<boolean>((res) => res(true))
  }
  extractIdentityFrom(entity: object): object {
    throw new Error('Method not implemented.')
  }
  containsIdentityOf(entity: object): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  getRecords(
    filter?: LogicalExpression,
    pagingParams?: PagingParams,
    sortingParams?: SortingField[],
  ): Promise<PaginatedList> {
    return new Promise<PaginatedList>((res) => {
      const result: any[] = this.objectGraph[this.propertyPath]
      return res({ page: result, total: result.length })
    })
  }
  getRecord(identityFields: object): Promise<object> {
    throw new Error('Method not implemented.')
  }
  getEntityRefs(
    filter?: LogicalExpression,
    pagingParams?: PagingParams,
    sortingParams?: SortingField[],
  ): Promise<PaginatedList> {
    return new Promise<PaginatedList>((res) => res({ page: [], total: 0 }))
  }
}
