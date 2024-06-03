import {
  EntitySchema,
  SchemaRoot,
  RelationSchema,
  FieldSchema,
  IndexSchema,
} from 'fusefx-modeldescription'
import { IDataSource } from 'ushell-modulebase'
import { capitalizeFirstLetter, getValue, lowerFirstLetter } from '../utils/StringUtils'
import { LogicalExpression } from 'fusefx-repositorycontract'

export class EntitySchemaService {
  static getUniversalSearchExpression(
    entitySchema: EntitySchema,
    universalSearchText: string,
  ): LogicalExpression | null {
    const fieldNames: string[] = []
    const indices: IndexSchema[] = entitySchema.indices
    indices.forEach((i) => {
      i.memberFieldNames.forEach((fn) => {
        if (!fieldNames.includes(fn)) {
          const fs: FieldSchema | undefined = entitySchema.fields.find((f) => f.name == fn)
          if (fs && fs.type.toLocaleLowerCase() == 'string') {
            fieldNames.push(fn)
          }
        }
      })
    })
    if (fieldNames.length == 0) return null
    const result: LogicalExpression = new LogicalExpression()
    result.matchAll = false
    result.subTree = []
    result.predicates = []
    fieldNames.forEach((fn) => {
      result.predicates.push({
        fieldName: fn,
        operator: '>=',
        value: universalSearchText,
      })
    })
    return result
  }
  static getLabel(schemaRoot: SchemaRoot, primaryEntityName: string, entity: any): string {
    if (!entity) return 'No Entity'

    if (entity.label) return entity.label
    if (entity.label) return entity.label
    const entitySchema: EntitySchema | undefined = schemaRoot.entities.find(
      (e) => e.name == primaryEntityName,
    )
    if (!entitySchema) return '???'
    const labelField: FieldSchema | undefined = entitySchema.fields.find(
      (f: FieldSchema) => f.identityLabel,
    )
    if (labelField) return getValue(entity, labelField.name)
    if (entity.name) return entity.name
    if (entity.Name) return entity.Name
    if (entity.id) return entity.id
    if (entity.Id) return entity.Id

    return '???'
  }

  static getLabelByEntitySchema(entitySchema: EntitySchema, entity: any): string {
    if (!entity) return 'Nope'
    if (entity.label) return entity.label
    if (entity.label) return entity.label
    const labelField: FieldSchema | undefined = entitySchema.fields.find(
      (f: FieldSchema) => f.identityLabel,
    )
    if (labelField) return getValue(entity, labelField.name)
    if (entity.id) return entity.id
    if (entity.Id) return entity.Id

    return '???'
  }

  static getPrimaryKeyProps(entitySchema: EntitySchema): string[] {
    const primaryIndex: IndexSchema | undefined = entitySchema.indices.find(
      (i) => i.name == entitySchema.primaryKeyIndexName,
    )
    if (!primaryIndex) {
      return [entitySchema.primaryKeyIndexName]
    }
    return primaryIndex.memberFieldNames
  }

  static getPrimaryKey(entitySchema: EntitySchema, entity: any): any {
    const props: string[] = this.getPrimaryKeyProps(entitySchema)
    if (props.length == 0) return undefined
    if (props.length == 1) {
      const id: string = props[0]
      if (id in entity) return entity[id]
      if (capitalizeFirstLetter(id) in entity) return entity[capitalizeFirstLetter(id)]
      if (lowerFirstLetter(id) in entity) return entity[lowerFirstLetter(id)]
      return undefined
    }
    const result: any = {}
    props.forEach((p, i) => {
      let v: any = undefined
      if (p in entity) {
        v = entity[p]
      } else if (capitalizeFirstLetter(p) in entity) {
        v = entity(capitalizeFirstLetter(p))
      } else if (lowerFirstLetter(p) in entity) {
        v = entity(lowerFirstLetter(p))
      }
      result['key' + i + 1] = v
    })
    return result
  }

  static getRelations(schemaRoot: SchemaRoot, entitySchema: EntitySchema, includeLookups: boolean) {
    return schemaRoot.relations.filter(
      (r) => r.primaryEntityName == entitySchema.name && (includeLookups || !r.isLookupRelation),
    )
  }
  static getRelationsByFilter(
    schemaRoot: SchemaRoot,
    filter: (r: RelationSchema) => boolean,
  ): RelationSchema[] {
    return schemaRoot.relations.filter((r) => filter(r))
  }

  static getAllLookUps(
    schemaRoot: SchemaRoot,
    getDatasource: (en: string) => IDataSource | null,
    entitySchema: EntitySchema,
  ) {
    const lookUpRelations: RelationSchema[] = EntitySchemaService.getRelationsByFilter(
      schemaRoot,
      (r: RelationSchema) => r.foreignEntityName == entitySchema.name && r.isLookupRelation,
    )
    const result: { [lookUpName: string]: { label: string; value: any }[] } = {}
    lookUpRelations.forEach((l) => {
      const ds: IDataSource | null = getDatasource(l.foreignEntityName)
      if (!ds) {
        throw 'No DataSource'
      }
      ds.getEntityRefs().then((r) => {
        result[l.foreignEntityName] = r.page
      })
    })
  }

  static getHtmlInputType(propertyType: string) {
    switch (propertyType.toLocaleLowerCase()) {
      case 'int32':
        return 'number'
      case 'datetime':
        return 'date'
      case 'bool':
      case 'boolean':
        return 'checkbox'
    }
    return 'text'
  }
}
