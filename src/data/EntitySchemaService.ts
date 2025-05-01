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
  static getKey(er: RelationSchema): import('react').Key | null | undefined {
    return er.primaryEntityName + er.foreignEntityName + er.foreignKeyIndexName
  }

  static areRelationsEqual(r1: RelationSchema | null, r2: RelationSchema | null): boolean {
    if (!r1 && !r2) return true
    if (!r1 || !r2) return false
    return this.getKey(r1) == this.getKey(r2)
  }

  static isNumber(fieldType: string) {
    return this.getHtmlInputType(fieldType) == 'number'
  }

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
        valueSerialized: universalSearchText,
      })
    })
    return result
  }

  static getLabelForRelationToForeign(schemaRoot: SchemaRoot, relation: RelationSchema): string {
    if (relation.primaryNavigationName && relation.primaryNavigationName != '') {
      return relation.primaryNavigationName
    }
    if (!relation.foreignEntityIsMultiple) {
      return relation.foreignEntityName
    }
    const entitySchema: EntitySchema | undefined = schemaRoot.entities.find(
      (e) => e.name == relation.foreignEntityName,
    )
    if (!entitySchema) return relation.foreignEntityName

    return entitySchema.namePlural
  }

  static getLabel(schemaRoot: SchemaRoot, primaryEntityName: string, entity: any): string {
    if (!entity) return 'No Entity'

    if (entity.label) return entity.label
    if (entity.Label) return entity.Label
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
    if (entity.Label) return entity.Label
    const labelField: FieldSchema | undefined = entitySchema.fields.find(
      (f: FieldSchema) => f.identityLabel,
    )
    if (labelField) return getValue(entity, labelField.name)

    if (entity.id) return entity.id.toLocaleString()
    if (entity.Id) return entity.Id.toLocaleString()

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

  static getPrimaryKeyExpression(entitySchema: EntitySchema, primaryKey: any): LogicalExpression {
    const primaryKeyProps: string[] = this.getPrimaryKeyProps(entitySchema)
    const result: LogicalExpression = new LogicalExpression()
    result.matchAll = true
    result.negate = false
    result.subTree = []
    result.predicates = []

    if (primaryKeyProps.length == 1) {
      const value: any = primaryKey
      result.predicates.push({
        fieldName: primaryKeyProps[0],
        operator: '=',
        valueSerialized: JSON.stringify(value),
      })
      return result
    }
    primaryKeyProps.forEach((pk, i) => {
      const value: any = primaryKey[`key_${i + 1}`]
      result.predicates.push({
        fieldName: pk,
        operator: '=',
        valueSerialized: JSON.stringify(value),
      })
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
      case 'int':
      case 'int16':
      case 'int32':
      case 'int64':
      case 'float':
      case 'decimal':
      case 'long':
      case 'integer':
      case 'double':
        return 'number'
      case 'datetime':
        return 'date'
      case 'bool':
      case 'boolean':
        return 'checkbox'
    }
    return 'text'
  }

  static findEntryWithMatchingIdentity(entities: any[], entity: any, schema: EntitySchema): any {
    return entities.find((e) => this.matchInIdentity(e, entity, schema))
  }

  static findIndexWithMatchingIdentity(entities: any[], entity: any, schema: EntitySchema): number {
    return entities.findIndex((e) => this.matchInIdentity(e, entity, schema))
  }

  static matchInIdentity(e1: any, e2: any, schema: EntitySchema): boolean {
    const key1: any = this.getPrimaryKey(schema, e1)
    const key2: any = this.getPrimaryKey(schema, e2)
    return this.compareDeep(key1, key2)
  }

  static compareDeep(o1: any, o2: any): boolean {
    const o1IsObject: boolean = typeof o1 == 'object'
    const o2IsObject: boolean = typeof o2 == 'object'
    if (o1IsObject !== o2IsObject) return false
    if (!o1IsObject) return o1 == o2
    for (let k1 in o1) {
      const k1ExistsInO2: boolean = k1 in o2
      if (!k1ExistsInO2) return false
      const v1: any = o1[k1]
      const v2: any = o2[k1]
      const innerResult: boolean = this.compareDeep(v1, v2)
      if (!innerResult) return false
    }
    return true
  }

  static clone(o: any, entitySchema: EntitySchema): any {
    const result: any = {}
    const primProps: string[] = this.getPrimaryKeyProps(entitySchema)
    const primPropsLowered: string[] = primProps.map((pp) => pp.toLocaleLowerCase())
    for (let f of entitySchema.fields) {
      if (f.dbGeneratedIdentity) continue
      let valueToSet: any = undefined
      let forceValue: boolean = false
      if (primPropsLowered.includes(f.name.toLocaleLowerCase())) {
        if (f.type.toLocaleLowerCase() == 'guid') {
          valueToSet = crypto.randomUUID()
          forceValue = true
        }
        if (this.isNumber(f.type)) {
          valueToSet = 0
          forceValue = true
        }
      }
      const lowerFieldName: string = lowerFirstLetter(f.name)
      const lowExsists: boolean = lowerFieldName in o
      const capFieldName: string = capitalizeFirstLetter(f.name)
      const capExists: boolean = capFieldName in o
      if (!lowExsists && !capExists) continue
      const finalFieldName: string = lowExsists ? lowerFieldName : capFieldName
      if (forceValue) {
        result[finalFieldName] = valueToSet
      } else {
        let finalValue: any = o[finalFieldName]
        if (f.identityLabel) {
          const copyMarker: string = ' - copy'
          const valueAsString: string = finalValue.toLocaleString()
          const indexOfCopy: number = valueAsString.indexOf(copyMarker)
          if (indexOfCopy >= 0) {
            const numberOfCopiesString = valueAsString
              .substring(indexOfCopy + copyMarker.length + 2)
              .trim()
            const numberOfCopies: number = (Number.parseInt(numberOfCopiesString) || 0) + 1
            finalValue = valueAsString.substring(0, copyMarker.length) + copyMarker
            finalValue += ` (${numberOfCopies}) `
          } else {
            finalValue += copyMarker
          }
        }
        result[finalFieldName] = finalValue
      }
    }
    return result
  }

  static createNewEntity(entitySchema: EntitySchema) {
    const result: any = {}
    const keyProps: string[] = EntitySchemaService.getPrimaryKeyProps(entitySchema)

    for (let fn of entitySchema.fields) {
      const isKey: boolean = keyProps.includes(fn.name)
      if (isKey && EntitySchemaService.isNumber(fn.type)) {
      } else if (isKey && fn.type.toLocaleLowerCase() == 'guid') {
        result[fn.name] = crypto.randomUUID()
      } else {
        if (fn.defaultValue) {
          result[fn.name] = fn.defaultValue
        } else if (fn.required) {
          switch (fn.type.toLocaleLowerCase()) {
            case 'int32':
            case 'int64':
            case 'float':
            case 'decimal':
              result[fn.name] = 0
              break
            case 'bool':
            case 'boolean':
              result[fn.name] = false
              break
            case 'datetime':
              result[fn.name] = new Date(1900, 1, 1)
              break
            case 'string':
            default:
              result[fn.name] = ''
          }
        } else {
          result[fn.name] = null
        }
      }
    }
    console.debug('creating new Entity', result)
    return result
  }

  static getErrors(v: any, required: boolean, inputType: string): string | null {
    if (required && inputType.toLocaleLowerCase().startsWith('bool')) {
      const isTrue = v == true
      const isFalse = v == false
      if (isTrue || isFalse) {
        return null
      } else {
        return 'Field is required'
      }
    }
    if (required && inputType.toLocaleLowerCase().startsWith('string')) {
      if (v == null || v == undefined) {
        return 'Field is required'
      } else {
        return null
      }
    }
    const isNumber = ['int32', 'int64', 'decimal', 'float', 'long', 'int', 'integer'].includes(
      inputType.toLocaleLowerCase(),
    )
    if (required && isNumber) {
      if (v == null || v == undefined) {
        return 'Field is required'
      } else {
        return null
      }
    }
    if (required && (v == null || v == undefined || v == '')) {
      return 'Field is required'
    }
    return null
  }
}
