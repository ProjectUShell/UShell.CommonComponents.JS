import { EntitySchema } from 'fusefx-modeldescription'

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

    console.log(content)
    return content
  }

  static async getEntitySchema(url: string): Promise<EntitySchema> {
    return this.post(url + `Api/GetSchemaRoot`)
  }

  static async getEntities(url: string, entityName: string): Promise<any> {
    return this.post(url + `Api/GetEntities`, { entityName: entityName })
  }
}
