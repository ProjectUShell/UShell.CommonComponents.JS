import React from 'react'
import { EntitySchema, RelationSchema, FieldSchema } from 'fusefx-modeldescription'
import RelationForm from './RelationForm'

const EditorProperties: React.FC<{
  entity: EntitySchema | undefined
  field: FieldSchema | null
  relation: RelationSchema | undefined
}> = ({ entity, relation, field }) => {
  return (
    <div>
      <div>{entity && entity.name}</div>
      <div>{field && field.name}</div>
      <div>{relation && <RelationForm relation={relation}></RelationForm>}</div>
    </div>
  )
}

export default EditorProperties
