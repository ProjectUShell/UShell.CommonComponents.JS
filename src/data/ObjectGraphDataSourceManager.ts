import { EntitySchema, SchemaRoot } from 'fusefx-modeldescription'
import { IDataSource, IDataSourceManagerWidget } from 'ushell-modulebase'
import { ObjectGraphDataSource } from './ObjectGraphDataSource'

export class ObjectGraphDataSourceManager implements IDataSourceManagerWidget {
  private schemaRoot: SchemaRoot
  private graph: any

  private onChangeHandlers: { [key: string]: (entityName: string) => void } = {}

  public registerOnChangeHandler(key: string, handler: (entityName: string) => void): void {
    this.onChangeHandlers[key] = handler
  }

  private fireOnChangeHandlers(entityName: string): void {
    console.log('firing onChange Handlers', this.onChangeHandlers)
    for (let h in this.onChangeHandlers) {
      this.onChangeHandlers[h](entityName)
    }
  }

  constructor(schemaRoot: SchemaRoot, graph: string) {
    this.schemaRoot = schemaRoot
    this.graph = graph
  }

  getPropertyPath(entityName: string): string {
    return `${entityName}s`
  }

  getCommonEntitySchema(name: string, entitySchemas: EntitySchema[]): EntitySchema {
    if (entitySchemas.length == 0) return new EntitySchema()
    if (entitySchemas.length == 1) return entitySchemas[0]
    const result: EntitySchema = new EntitySchema()
    result.name = name
    result.namePlural = name + 's'
    let fieldNames: string[] = entitySchemas[0].fields.map((f) => f.name)
    for (let i = 0; i < entitySchemas.length; i++) {
      const fieldNamesI: string[] = entitySchemas[i].fields.map((fn) => fn.name)
      fieldNames = fieldNames.filter((fn) => fieldNamesI.includes(fn))
    }
    result.fields = entitySchemas[0].fields.filter((f) => fieldNames.includes(f.name))

    let indexNames: string[] = entitySchemas[0].indices.map((i) => i.name)
    for (let i = 0; i < entitySchemas.length; i++) {
      const indexNamesI: string[] = entitySchemas[i].indices.map((i) => i.name)
      indexNames = indexNames.filter((fn) => indexNamesI.includes(fn))
    }
    result.indices = entitySchemas[0].indices.filter((i) => indexNames.includes(i.name))

    result.primaryKeyIndexName = entitySchemas[0].primaryKeyIndexName
    return result
  }

  tryGetDataSource(entityName: string, storeName?: string): IDataSource | null {
    const propertyPath: string = this.getPropertyPath(entityName)
    const entitySchema: EntitySchema | undefined = this.getSchemaRoot().entities.find(
      (e: EntitySchema) => e.name == entityName,
    )
    if (!entityName) return null
    return this.tryGetDataSourceByPropertyPath(propertyPath, entitySchema!)
  }

  tryGetDataSourceByPropertyPath(
    propertyPath: string,
    entitySchema: EntitySchema,
  ): IDataSource | null {
    return new ObjectGraphDataSource(entitySchema, this.graph, propertyPath, (g) => {
      console.log('onChanged Graph', g)
      // this.graphRepo.saveWorkflow(entitySchema, g)
      this.fireOnChangeHandlers(entitySchema.name)
    })
  }

  getSchemaRoot(): SchemaRoot {
    return this.schemaRoot
  }
}
