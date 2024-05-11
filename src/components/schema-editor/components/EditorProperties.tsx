import React from 'react'
import { EntitySchema, RelationSchema, FieldSchema } from 'fusefx-modeldescription'
import RelationForm from './RelationForm'
import FieldForm from './FieldForm'

const EditorProperties: React.FC<{
  entity: EntitySchema | undefined
  field: FieldSchema | null
  relation: RelationSchema | undefined
  onChange: () => void
}> = ({ entity, relation, field, onChange }) => {
  return (
    <div>
      <div>{entity && entity.name}</div>
      <div>{field && <FieldForm field={field} onChange={onChange}></FieldForm>}</div>
      <div>{relation && <RelationForm relation={relation} onChange={onChange}></RelationForm>}</div>
    </div>
  )
}

export default EditorProperties
