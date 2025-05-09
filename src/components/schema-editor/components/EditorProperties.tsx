import React from 'react'
import { EntitySchema, RelationSchema, FieldSchema, IndexSchema } from 'fusefx-modeldescription'
import RelationForm from './RelationForm'
import FieldForm from './FieldForm'
import IndexForm from './IndexForm'

const EditorProperties: React.FC<{
  entity: EntitySchema | undefined
  field: FieldSchema | null
  relation: RelationSchema | undefined
  index: IndexSchema | null
  onChange: () => void
}> = ({ entity, relation, field, index, onChange }) => {
  return (
    <div className='flex flex-col gap-2 p-2'>
      {entity && (
        <div className=' flex flex-col gap-2'>
          <div className='font-bold '>{entity.name}</div>
          <div>Color</div>
        </div>
      )}
      <div>{field && <FieldForm field={field} onChange={onChange}></FieldForm>}</div>
      <div>{relation && <RelationForm relation={relation} onChange={onChange}></RelationForm>}</div>
      <div>
        {index && entity && (
          <IndexForm entitySchema={entity} index={index} onChange={onChange}></IndexForm>
        )}
      </div>
    </div>
  )
}

export default EditorProperties
