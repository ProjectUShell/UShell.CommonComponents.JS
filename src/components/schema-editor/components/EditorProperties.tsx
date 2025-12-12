import React, { useState } from 'react'
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
  const [activeTab, setActiveTab] = useState<'layout' | 'data'>('layout')

  const showEntityTabs = entity && !field && !relation && !index

  return (
    <div className='flex flex-col gap-2 p-2 h-full'>
      {showEntityTabs && (
        <div className='flex flex-col gap-2 h-full'>
          <div className='font-bold'>{entity.name}</div>

          {/* Tab buttons */}
          <div className='flex border-b border-contentBorder dark:border-contentBorderDark'>
            <button
              onClick={() => setActiveTab('layout')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'layout'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-content dark:text-contentDark hover:text-contentSelected dark:hover:text-contentSelectedDark'
              }`}
            >
              Layout
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'data'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-content dark:text-contentDark hover:text-contentSelected dark:hover:text-contentSelectedDark'
              }`}
            >
              Data
            </button>
          </div>

          {/* Tab content */}
          <div className='flex-1 overflow-auto'>
            {activeTab === 'layout' && (
              <div className='flex flex-col gap-2'>
                <div>Color</div>
                {/* More layout properties will go here */}
              </div>
            )}
            {activeTab === 'data' && (
              <div className='flex flex-col gap-2'>
                <div>Data properties will go here</div>
                {/* Data properties will go here */}
              </div>
            )}
          </div>
        </div>
      )}
      {field && <FieldForm field={field} onChange={onChange}></FieldForm>}
      {relation && <RelationForm relation={relation} onChange={onChange}></RelationForm>}
      {index && entity && (
        <IndexForm entitySchema={entity} index={index} onChange={onChange}></IndexForm>
      )}
    </div>
  )
}

export default EditorProperties
