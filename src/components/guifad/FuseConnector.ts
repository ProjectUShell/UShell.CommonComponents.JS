import { EntitySchema, SchemaRoot } from 'fusefx-modeldescription'
import { LogicalExpression } from 'ushell-modulebase/lib/LogicalExpression'
import { PaginatedList } from 'ushell-modulebase/lib/PaginatedList'
import { PagingParams } from 'ushell-modulebase/lib/PagingParams'
import { SortingField } from 'ushell-modulebase/lib/SortingField'

export class FuseConnector {
  private static async post(url: string, bodyParams: any = null): Promise<any> {
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

  static async getEntitySchema(url: string): Promise<SchemaRoot | null> {
    return this.post(url + `GetSchemaRoot`)
      .then((r) => r.return)
      .catch((e) => null)
  }

  static async getEntities(
    url: string,
    entityName: string,
    filter?: LogicalExpression,
    pagingParams?: PagingParams,
    sortingParams?: SortingField[],
  ): Promise<PaginatedList> {
    return this.post(url + `GetEntities`, {
      entityName: entityName,
      filter: filter,
      pagingParams: pagingParams,
      sortingParams: sortingParams,
    }).then((r) => r.return)
  }

  static async getEntityRefs(
    url: string,
    entityName: string,
    filter?: LogicalExpression,
    pagingParams?: PagingParams,
    sortingParams?: SortingField[],
  ): Promise<PaginatedList> {
    return this.post(url + `GetEntityRefs`, {
      entityName: entityName,
      filter: filter,
      pagingParams: pagingParams,
      sortingParams: sortingParams,
    }).then((r) => r.return)
  }

  static async addOrUpdate(url: string, entityName: string, entity: any): Promise<any> {
    return this.post(url + `AddOrUpdate`, { entityName: entityName, entity: entity }).then((r) => r.return)
  }

  static async deleteEntities(url: string, entityName: string, idsToDelete: any[][]): Promise<any> {
    return this.post(url + `DeleteEntities`, { entityName: entityName, idsToDelete: idsToDelete }).then((r) => {
      console.log('res del', r)
      return r
    })
  }
}
