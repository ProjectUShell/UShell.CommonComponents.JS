import { GetFuseDatasource } from '../components/guifad/FuseDatasource'
import { IDataSource, IDataStore, IDataSourceManagerBase } from 'ushell-modulebase'
import { FuseConnector } from './FuseConnector'
import { SchemaRoot, EntitySchema } from 'fusefx-modeldescription'

export class FuseDataStore implements IDataStore, IDataSourceManagerBase {
  private _Url: string
  private _SchemaRoot: SchemaRoot | null = null

  constructor(url: string) {
    this._Url = url
  }

  init(): Promise<void> {
    return FuseConnector.getEntitySchema(this._Url).then((sr) => {
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
    const es: EntitySchema | undefined = this.getSchemaRoot().entities.find((e) => e.name == enityName)
    if (!es) {
      return null
    }
    return GetFuseDatasource(this._Url, es)
  }
}
