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

  private loadSchemaRoot(): Promise<SchemaRoot> {
    return FuseConnector.getEntitySchema(this._Url).then((sr) => {
      if (!sr) {
        throw 'no SchemaRoot'
      }
      this._SchemaRoot = sr
      return sr
    })
  }

  getSchemaRoot(): Promise<SchemaRoot> {
    if (this._SchemaRoot) {
      return new Promise<SchemaRoot>((resolve, reject) => {
        resolve(this._SchemaRoot!)
      })
    }
    return this.loadSchemaRoot().then((sr) => sr)
  }

  tryGetDataSource(enityName: string): Promise<IDataSource | null> {
    console.log('tryGetDataSource', enityName)
    return this.getSchemaRoot().then((sr) => {
      console.log('sr', sr)
      const es: EntitySchema | undefined = sr.entities.find((e) => e.name == enityName)
      if (!es) {
        return null
      }
      return GetFuseDatasource(this._Url, es)
    })
  }
}
