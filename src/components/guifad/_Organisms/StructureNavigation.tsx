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
  return (
    <div className={`pl-2 text-md ${className}`}>
      <h1 className='mb-2 font-bold'>
        {currentRecord
          ? entitySchema.name +
            ' ' +
            EntitySchemaService.getLabel(schemaRoot, entitySchema.name, currentRecord)
          : entitySchema.name}
      </h1>
      <button
        disabled={dirty}
        className={`w-full flex gap-1 items-center  ${
          dirty ? 'hover:cursor-pointer text-gray-400' : ''
        } rounded-l-md p-1 ${
          mode == 'list' ? 'bg-bg1 dark:bg-bg2dark' : 'hover:bg-hoverItem dark:hover:bg-bg3dark'
        }`}
        onClick={(e) => setMode('list')}
      >
        <ListIcon></ListIcon>List
      </button>
      <button
        disabled={!currentRecord}
        className={`w-full flex gap-1 items-center  ${
          !currentRecord ? 'text-gray-400 hover:cursor-default' : 'hover:cursor-pointer'
        } ${
          mode == 'details' ? 'bg-bg1 dark:bg-bg2dark' : 'hover:bg-hoverItem dark:hover:bg-bg3dark'
        } rounded-l-md p-1`}
        onClick={(e) => setMode('details')}
      >
        <PencilIcon></PencilIcon>Details
      </button>
      <div className='w-full border-b-2 my-1 border-texttwo dark:border-textonedark'></div>
      {EntitySchemaService.getRelations(schemaRoot, entitySchema, false).map((er) => (
        <button
          key={er.primaryNavigationName}
          disabled={!currentRecord || dirty}
          className={`w-full flex gap-1 items-center hover:text-blue-600 dark:hover:text-blue-200  ${
            !currentRecord || dirty ? 'text-gray-400 hover:cursor-default' : 'hover:cursor-pointer'
          } rounded-md p-1 ${
            relation?.primaryNavigationName == er.primaryNavigationName
              ? !currentRecord || dirty
                ? ''
                : 'underline'
              : ''
          }`}
          onClick={() => onRelationSelected(er)}
          onDoubleClick={() => onRelationEnter(er)}
        >
          <FolderIcon></FolderIcon>
          {er.primaryNavigationName && er.primaryNavigationName != ''
            ? er.primaryNavigationName
            : er.foreignEntityName}
        </button>
      ))}
    </div>
  )
}

export default StructureNavigation
