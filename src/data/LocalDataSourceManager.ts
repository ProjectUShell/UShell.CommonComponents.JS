import { IDataSource, IDataSourceManagerWidget } from 'ushell-modulebase'
import { LocalStoreDataSource } from './LocalStoreDataSource'
import { SchemaRoot } from 'fusefx-modeldescription'
export class LocalStoreDataSourceManager implements IDataSourceManagerWidget {
  private schemaRoot: SchemaRoot
  private dataSources: Map<string, LocalStoreDataSource> = new Map()

  private id: string
  constructor(schemaRoot: SchemaRoot, id?: string) {
    this.schemaRoot = schemaRoot
    this.id = id ? id : crypto.randomUUID()
  }
  tryGetDataSource(entityName: string, storeName?: string): IDataSource {
    const key = storeName ? `${storeName}:${entityName}` : entityName
    if (!this.dataSources.has(key)) {
      const newDataSource = new LocalStoreDataSource(
        this.id,
        this.schemaRoot.entities.find(
          (e) => e.name.toLocaleLowerCase() == entityName.toLocaleLowerCase(),
        ),
      )
      this.dataSources.set(key, newDataSource)
    }
    const result = this.dataSources.get(key)!
    return result
  }

  getSchemaRoot(): SchemaRoot {
    return this.schemaRoot
  }
}
