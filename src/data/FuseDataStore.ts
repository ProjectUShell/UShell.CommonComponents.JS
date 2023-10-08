import { GetFuseDatasource } from '../components/guifad/FuseDatasource'
import { IDataSourceManager, IDataSourceManagerBase } from '../ushell-modulebase/lib/IDataSourceManager'
import { IDataStore } from '../ushell-modulebase/lib/IDataStore'
import { IDataSource } from '../ushell-modulebase/lib/iDataSource'
import { FuseConnector } from './FuseConnector'
import { SchemaRoot, EntitySchema } from 'fusefx-modeldescription'

export class FuseDataStore implements IDataStore, IDataSourceManagerBase {
  private _Url: string
  private _SchemaRoot: SchemaRoot = new SchemaRoot()

  constructor(url: string) {
    this._Url = url
  }

  private loadSchemaRoot(): Promise<void> {
    return FuseConnector.getEntitySchema(this._Url).then((sr) => {
      if (!sr) {
        throw 'no SchemaRoot'
      }
      this._SchemaRoot = sr!
    })
  }

  getSchemaRoot(): Promise<SchemaRoot> {
    if (this._SchemaRoot) {
      return new Promise<SchemaRoot>(() => this._SchemaRoot)
    }
    return this.loadSchemaRoot().then(() => this._SchemaRoot)
  }

  tryGetDataSource(enityName: string): Promise<IDataSource | null> {
    return this.getSchemaRoot().then((sr) => {
      const es: EntitySchema | undefined = sr.entities.find((e) => e.name == enityName)
      if (!es) {
        return null
      }
      return GetFuseDatasource(this._Url, es)
    })
  }
}
