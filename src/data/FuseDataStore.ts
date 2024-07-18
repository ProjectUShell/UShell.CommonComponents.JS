import { IDataSource, IDataStore, IDataSourceManagerBase } from 'ushell-modulebase'
import { SchemaRoot, EntitySchema } from 'fusefx-modeldescription'
import { FuseDataSourceBody } from './FuseDataSourceBody'
import { FuseDataSourceRoute } from './FuseDataSourceRoute'
import { FuseDataSourceMethod } from './FuseDataSourceMethod'

export class FuseDataStore implements IDataStore, IDataSourceManagerBase {
  public static getTokenMethod: ((tokenSourceUid: string) => string) | null = null

  public async post(url: string, bodyParams: any = null): Promise<any> {
    const headers: any = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    if (FuseDataStore.getTokenMethod) {
      headers['Authorization'] = FuseDataStore.getTokenMethod(this._TokenSourceUid)
    }
    if (this._AdditionalBodyArgs && bodyParams) {
      for (let additionalKey in this._AdditionalBodyArgs) {
        bodyParams[additionalKey] = this._AdditionalBodyArgs[additionalKey]
      }
    }
    if (this._AdditionalHeaderArgs) {
      for (let additionalKey in this._AdditionalHeaderArgs) {
        headers[additionalKey] = JSON.stringify(this._AdditionalHeaderArgs[additionalKey])
      }
    }
    const rawResponse = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: bodyParams ? JSON.stringify(bodyParams) : null,
    })
    const content = await rawResponse.json()

    return content
  }

  private _Url: string
  private _EntitySchemaUrl: string
  private _SchemaRoot: SchemaRoot | null = null
  private _RoutePattern: 'body' | 'route' | 'method' = 'body'
  private _TokenSourceUid = ''
  private _AdditionalBodyArgs: any | null = null
  private _GetSchemaRootMethod: string | null = null
  private _AdditionalHeaderArgs: any | null = null

  constructor(
    url: string,
    routePattern: 'body' | 'route' | 'method',
    entitySchemaUrl?: string,
    tokenSourceUid?: string,
    additionalBodyArgs?: any,
    getSchemaRootMethod?: any,
    additionalHeaderArgs?: any,
  ) {
    this._Url = url
    this._EntitySchemaUrl = entitySchemaUrl ? entitySchemaUrl : url
    this._RoutePattern = routePattern
    this._TokenSourceUid = tokenSourceUid ? tokenSourceUid : ''
    this._AdditionalBodyArgs = additionalBodyArgs ? additionalBodyArgs : null
    this._GetSchemaRootMethod = getSchemaRootMethod ? getSchemaRootMethod : null
    this._AdditionalHeaderArgs = additionalHeaderArgs ? additionalHeaderArgs : null
  }

  init(): Promise<void> {
    const gsr: string = this._GetSchemaRootMethod ? this._GetSchemaRootMethod : 'GetSchemaRoot'
    return this.post(this._EntitySchemaUrl + gsr)
      .then((r) => r.return)
      .catch((e) => null)
      .then((sr) => {
        if (!sr) {
          throw 'no SchemaRoot'
        }
        this._SchemaRoot = sr
      })
  }

  getSchemaRoot(): SchemaRoot {
    if (this._SchemaRoot) {
      return this._SchemaRoot
    }
    throw 'no SchemaRoot'
  }

  tryGetDataSource(enityName: string): IDataSource | null {
    const es: EntitySchema | undefined = this.getSchemaRoot().entities.find(
      (e) => e.name == enityName,
    )
    if (!es) {
      return null
    }
    switch (this._RoutePattern) {
      case 'body':
        return new FuseDataSourceBody(this._Url, es, this)
      case 'route':
        return new FuseDataSourceRoute(this._Url, es, this)
      case 'method':
        return new FuseDataSourceMethod(this._Url, es, this)
    }
  }
}
