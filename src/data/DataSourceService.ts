import { EntitySchema, FieldSchema, IndexSchema, RelationSchema, SchemaRoot } from 'fusefx-modeldescription'
import { LogicalExpression } from 'fusefx-repositorycontract'
import { lowerFirstLetter } from '../utils/StringUtils'

export function getParentFilter(
  schemaRoot: SchemaRoot,
  parentSchema: EntitySchema,
  childSchema: EntitySchema,
  parent: any,
): LogicalExpression | null {
  const pks: IndexSchema[] = parentSchema.indices.filter((i) => i.name === parentSchema.primaryKeyIndexName)
  const childToParentRelations: RelationSchema[] = schemaRoot.relations.filter(
    (r) => r.primaryEntityName === parentSchema.name && r.foreignEntityName === childSchema.name,
  )
  if (childToParentRelations.length <= 0) {
    console.log('no childToParentRelations')
    return null
  }
  const childToParentRelation: RelationSchema = childToParentRelations[0]
  const result: LogicalExpression = new LogicalExpression()

  const pk: IndexSchema | null = pks.length > 0 ? pks[0] : null

  const parentIdFieldName: string | null = !pk || pk.memberFieldNames.length !== 1 ? null : pk.memberFieldNames[0]

  const parentField: FieldSchema | undefined = parentIdFieldName
    ? parentSchema.fields.find((f) => f.name === parentIdFieldName)
    : undefined

  const parentIdFieldType: string = parentField ? parentField.type : 'int'
  const parentIdName: string = parentIdFieldName || 'id'
  console.log('parentIdName', parentIdName)
  console.log('parent', parent)
  const parentKeyValue = parent[parentIdName]
  if (!parentKeyValue) return result
  result.predicates.push({
    operator: '=',
    fieldName: childToParentRelation.foreignKeyIndexName,
    value: parent[parentIdName],
  })
  console.log('result', result)
  return result
}

export function setParentId(
  child: any,
  schemaRoot: SchemaRoot,
  parentSchema: EntitySchema,
  childSchema: EntitySchema,
  parent: any,
): void {
  console.log('setParentId parentSchema', parentSchema)
  const pks: IndexSchema[] = parentSchema.indices.filter((i) => i.name === parentSchema.primaryKeyIndexName)
  console.log('setParentId pks', pks)
  const childToParentRelations: RelationSchema[] = schemaRoot.relations.filter(
    (r) => r.primaryEntityName === parentSchema.name && r.foreignEntityName === childSchema.name,
  )
  if (childToParentRelations.length <= 0) {
    return
  }
  const childToParentRelation: RelationSchema = childToParentRelations[0]

  const pk: IndexSchema | null = pks.length > 0 ? pks[0] : null

  const parentIdFieldName: string | null = !pk || pk.memberFieldNames.length !== 1 ? null : pk.memberFieldNames[0]

  const parentIdName: string = parentIdFieldName || 'id'
  console.log('parentIdName', parentIdName)
  console.log('parent', parent)
  child[childToParentRelation.foreignKeyIndexName] = parent[parentIdName]
}
