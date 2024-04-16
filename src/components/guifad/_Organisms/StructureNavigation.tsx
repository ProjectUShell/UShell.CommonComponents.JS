import React from 'react'
import { ObjectGraphNode } from '../ObjectGraphNode'
import { EntitySchema, RelationSchema, SchemaRoot } from 'fusefx-modeldescription'
import { EntitySchemaService } from '../../../data/EntitySchemaService'
import ListIcon from '../../../_Icons/ListIcon'
import FolderIcon from '../../shell-layout/_Icons/FolderIcon'
import PencilIcon from '../../../_Icons/PencilIcon'
import { lowerFirstLetter } from '../../../utils/StringUtils'

const StructureNavigation: React.FC<{
  currentRecord: any
  entitySchema: EntitySchema
  schemaRoot: SchemaRoot
  onRelationSelected: (rel: RelationSchema) => void
  onRelationEnter: (rel: RelationSchema) => void
  setMode: (mode: 'list' | 'details') => void
  mode: 'list' | 'details'
  relation: RelationSchema | null
  className?: string
  dirty: boolean
}> = ({
  currentRecord,
  entitySchema,
  schemaRoot,
  onRelationSelected,
  setMode,
  onRelationEnter,
  mode,
  relation,
  className,
  dirty,
}) => {
  console.log('StructureNav schemaRoot', schemaRoot)

  return (
    <div className={`text-md ${className}`}>
      <h1 className='mb-2 font-bold'>
        {currentRecord
          ? entitySchema.name + ' ' + EntitySchemaService.getLabel(schemaRoot, entitySchema.name, currentRecord)
          : entitySchema.name}
      </h1>
      <button
        disabled={dirty}
        className={`w-full flex gap-1 disabled:text-gray-400 enabled:hover:bg-blue-200 enabled:dark:hover:bg-blue-300 enabled:hover:cursor-pointer rounded-md p-1 ${
          mode == 'list' ? 'bg-blue-300 dark:bg-blue-400' : ''
        }`}
        onClick={(e) => setMode('list')}
      >
        <ListIcon></ListIcon>List
      </button>
      <button
        disabled={!currentRecord}
        className={`w-full flex gap-1 disabled:text-gray-400 enabled:hover:bg-blue-200 enabled:dark:hover:bg-blue-300 ${
          mode == 'details' ? 'bg-blue-300 dark:bg-blue-400' : ''
        } enabled:hover:cursor-pointer rounded-md p-1`}
        onClick={(e) => setMode('details')}
      >
        <PencilIcon></PencilIcon>Details
      </button>
      <div className='w-full border-b-2 my-1 border-texttwo dark:border-textonedark'></div>
      {EntitySchemaService.getRelations(schemaRoot, entitySchema, false).map((er) => (
        <button
          key={er.primaryNavigationName}
          disabled={!currentRecord || dirty}
          className={`w-full flex gap-1 disabled:text-gray-400 enabled:hover:bg-green-200 enabled:dark:hover:bg-blue-300 enabled:hover:cursor-pointer rounded-md p-1 ${
            relation?.primaryNavigationName == er.primaryNavigationName
              ? 'enabled:bg-blue-300 enabled:dark:bg-blue-400'
              : ''
          }`}
          onClick={() => onRelationSelected(er)}
          onDoubleClick={() => onRelationEnter(er)}
        >
          <FolderIcon></FolderIcon> {er.primaryNavigationName}
        </button>
      ))}
    </div>
  )
}

export default StructureNavigation
