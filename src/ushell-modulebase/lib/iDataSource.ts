import { EntitySchema } from 'fusefx-modeldescription'
import { PagingParams } from '../../fusefx-repositorycontract/PagingParams'
import { PaginatedList } from '../../fusefx-repositorycontract/PaginatedList'
import { LogicalExpression } from '../../fusefx-repositorycontract/LogicalExpression'
import { SortingField } from '../../fusefx-repositorycontract/SortingField'

export interface IDataSource {
  // TODO: transformation to a state of max compatibility to UDAS-standard WIP

  dataSourceUid: string
  entitySchema?: EntitySchema

  // if null, the action is not supported!
  readonly entityFactoryMethod: () => any
  readonly entityUpdateMethod: (entity: any[]) => Promise<boolean>
  readonly entityInsertMethod: (entity: any[]) => Promise<boolean>
  readonly entityDeleteMethod: (entity: any[]) => Promise<boolean>

  // getRecordCount(): Observable<number>;

  extractIdentityFrom(entity: object): object
  containsIdentityOf(entity: object): Promise<boolean>

  getRecords(
    filter?: LogicalExpression,
    pagingParams?: PagingParams,
    sortingParams?: SortingField[],
  ): Promise<PaginatedList>
  getRecord(identityFields: object): Promise<object>
  getEntityRefs(
    filter?: LogicalExpression,
    pagingParams?: PagingParams,
    sortingParams?: SortingField[],
  ): Promise<PaginatedList>
}
