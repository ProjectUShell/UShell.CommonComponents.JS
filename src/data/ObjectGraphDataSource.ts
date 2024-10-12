import { EntitySchema } from 'fusefx-modeldescription'
import { matchOnPrimaryKeyIndex } from 'fusefx-modeldescription/lib/utils'
import {
  LogicalExpression,
  PagingParams,
  SortingField,
  PaginatedList,
} from 'fusefx-repositorycontract'
import { IDataSource } from 'ushell-modulebase'
import { applyFilter, applySorting } from '../utils/LogicUtils'
import { EntitySchemaService } from './EntitySchemaService'

export class ObjectGraphDataSource implements IDataSource {
  dataSourceUid: string = crypto.randomUUID()
  entitySchema: EntitySchema

  private objectGraph: any
  private propertyPath: string
  private onGraphChanged: (g: any) => void
  constructor(
    entitySchema: EntitySchema,
    objectGraph: any,
    propertyPath: string,
    onGraphChanged?: (g: any) => void,
  ) {
    this.entitySchema = entitySchema
    this.objectGraph = objectGraph
    this.propertyPath = propertyPath
    this.onGraphChanged = onGraphChanged || ((g) => {})
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
      this.onGraphChanged(this.objectGraph)
      return res(true)
    })
  }
  entityInsertMethod(entity: any[]) {
    console.log('inserting', entity)
    return new Promise<boolean>((res) => {
      this.objectGraph[this.propertyPath].push(entity)
      this.onGraphChanged(this.objectGraph)
      return res(true)
    })
  }
  entityDeleteMethod(entities: any[]) {
    for (let entity of entities) {
      const idx: number = EntitySchemaService.findIndexWithMatchingIdentity(
        this.objectGraph[this.propertyPath],
        entity,
        this.entitySchema,
      )
      this.objectGraph[this.propertyPath].splice(idx, 1)
    }
    this.onGraphChanged(this.objectGraph)
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
      console.log('getRecords', filter)
      let result: any[] = this.objectGraph[this.propertyPath]
      if (filter) {
        result = applyFilter(result, filter)
      }
      if (sortingParams) {
        result = applySorting(
          result,
          sortingParams,
          sortingParams.map((sp) => {
            return { fieldType: this.entitySchema.fields.find((f) => f.name == sp.fieldName)!.type }
          }),
        )
      }

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
