import { EntitySchema, SchemaRoot } from 'fusefx-modeldescription'
import { SortingField, LogicalExpression, PagingParams, PaginatedList } from 'fusefx-repositorycontract'

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
      limit: pagingParams?.pageSize,
      skip: pagingParams ? (pagingParams?.pageNumber - 1) * pagingParams?.pageSize : 0,
      sortingParams: sortingParams,
    }).then((r) => {
      return { page: r.return, total: 1000 }
    })
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

  static async addOrUpdate(url: string, entityName: string, entity: any): Promise<any> {
    return this.post(url + `AddOrUpdateEntity`, { entityName: entityName, entity: entity }).then((r) => {
      if (r.fault) {
        console.error('AddOrUpdate failed', { entity: entity, fault: r.fault })
      }
      return r.return
    })
  }

  static async deleteEntities(url: string, entityName: string, idsToDelete: any[][]): Promise<any> {
    return this.post(url + `DeleteEntities`, { entityName: entityName, idsToDelete: idsToDelete }).then((r) => {
      return r
    })
  }
}
