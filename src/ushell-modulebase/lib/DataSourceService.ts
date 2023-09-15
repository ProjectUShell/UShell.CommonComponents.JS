import { EntitySchema, FieldSchema, IndexSchema, RelationSchema, SchemaRoot } from 'fusefx-modeldescription'
import { LogicalExpression } from '../../fusefx-repositorycontract/LogicalExpression'

export function getParentFilter(
  schemaRoot: SchemaRoot,
  parentSchema: EntitySchema,
  childSchema: EntitySchema,
  parent: any,
): LogicalExpression | null {
  const pks: IndexSchema[] = parentSchema.indices.filter((i) => i.name === parentSchema.PrimaryKeyIndexName)
  const childToParentRelations: RelationSchema[] = schemaRoot.relations.filter(
    (r) => r.primaryEntityName === childSchema.name && r.foreignEntityName === parentSchema.name,
  )
  if (childToParentRelations.length <= 0) {
    return null
  }
  const childToParentRelation: RelationSchema = childToParentRelations[0]
  const result: LogicalExpression = new LogicalExpression()
  result.operator = ''

  const pk: IndexSchema | null = pks.length > 0 ? pks[0] : null
  if (!pk || pk.memberFieldNames.length !== 1) {
    return null // Not Supported
  }

  const parentIdFieldName: string | null = !pk || pk.memberFieldNames.length !== 1 ? null : pk.memberFieldNames[0]

  const parentField: FieldSchema | undefined = parentIdFieldName
    ? parentSchema.fields.find((f) => f.name === parentIdFieldName)
    : undefined

  const parentIdFieldType: string = parentField ? parentField.type : 'int'
  const parentIdName: string = parentIdFieldName || 'id'
  result.atomArguments.push({
    relation: '=',
    propertyName: childToParentRelation.foreignKeyIndexName,
    value: parent[parentIdName],
    propertyType: parentIdFieldType,
  })
  return result
}
