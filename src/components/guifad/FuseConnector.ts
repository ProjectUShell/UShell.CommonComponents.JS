import { EntitySchema, SchemaRoot } from 'fusefx-modeldescription'

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

  static async getEntitySchema(url: string): Promise<SchemaRoot> {
    return this.post(url + `GetSchemaRoot`).then((r) => r.return)
  }

  static async getEntities(url: string, entityName: string): Promise<any> {
    return this.post(url + `GetEntities`, { entityName: entityName }).then((r) => r.return)
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
