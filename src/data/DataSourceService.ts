import {
  EntitySchema,
  FieldSchema,
  IndexSchema,
  RelationSchema,
  SchemaRoot,
} from 'fusefx-modeldescription'
import { LogicalExpression } from 'fusefx-repositorycontract'
import { lowerFirstLetter } from '../utils/StringUtils'

export function getParentFilter(
  schemaRoot: SchemaRoot,
  parentSchema: EntitySchema,
  childSchema: EntitySchema,
  parent: any,
): LogicalExpression | null {
  const pks: IndexSchema[] = parentSchema.indices.filter(
    (i) => i.name === parentSchema.primaryKeyIndexName,
  )
  const childToParentRelations: RelationSchema[] = schemaRoot.relations.filter(
    (r) => r.primaryEntityName === parentSchema.name && r.foreignEntityName === childSchema.name,
  )
  if (childToParentRelations.length <= 0) {
    return null
  }
  const childToParentRelation: RelationSchema = childToParentRelations[0]
  const result: LogicalExpression = new LogicalExpression()

  const pk: IndexSchema | null = pks.length > 0 ? pks[0] : null

  const parentIdFieldName: string | null =
    !pk || pk.memberFieldNames.length !== 1 ? null : pk.memberFieldNames[0]

  const parentField: FieldSchema | undefined = parentIdFieldName
    ? parentSchema.fields.find((f) => f.name === parentIdFieldName)
    : undefined

  const parentIdFieldType: string = parentField ? parentField.type : 'int'
  const parentIdName: string = parentIdFieldName || 'Id'
  const parentKeyValue =
    parentIdName in parent ? parent[parentIdName] : parent[lowerFirstLetter(parentIdName)]
  if (!parentKeyValue) return result
  result.predicates.push({
    operator: '=',
    fieldName: childToParentRelation.foreignKeyIndexName,
    valueSerialized: JSON.stringify(parentKeyValue),
  })
  return result
}

export function setParentId(
  child: any,
  schemaRoot: SchemaRoot,
  parentSchema: EntitySchema,
  childSchema: EntitySchema,
  parent: any,
): void {
  const pks: IndexSchema[] = parentSchema.indices.filter(
    (i) => i.name === parentSchema.primaryKeyIndexName,
  )
  const childToParentRelations: RelationSchema[] = schemaRoot.relations.filter(
    (r) => r.primaryEntityName === parentSchema.name && r.foreignEntityName === childSchema.name,
  )
  if (childToParentRelations.length <= 0) {
    return
  }
  const childToParentRelation: RelationSchema = childToParentRelations[0]

  const pk: IndexSchema | null = pks.length > 0 ? pks[0] : null

  //TODO_RWE support multiple key fields
  const parentIdFieldName: string | null =
    !pk || pk.memberFieldNames.length !== 1 ? null : pk.memberFieldNames[0]

  const parentIdName: string = parentIdFieldName || 'id'

  const foreignKeyIndexField: FieldSchema | undefined = childSchema.fields.find(
    (f) => f.name == childToParentRelation.foreignKeyIndexName,
  )
  if (foreignKeyIndexField) {
    child[foreignKeyIndexField.name] =
      parentIdName in parent ? parent[parentIdName] : parent[lowerFirstLetter(parentIdName)]
  } else {
    child[childToParentRelation.foreignNavigationName] = parent
  }
}
