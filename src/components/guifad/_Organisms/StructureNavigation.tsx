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
  hideList: any
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
  hideList,
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
      <h1 className='pb-2 font-bold border-r border-navigationBorder dark:border-navigationBorderDark whitespace-normal'>
        {currentRecord
          ? entitySchema.name +
            ' ' +
            EntitySchemaService.getLabel(schemaRoot, entitySchema.name, currentRecord)
          : entitySchema.name}
      </h1>
      {!hideList && (
        <button
          disabled={dirty}
          className={`w-full flex gap-1 items-center   ${
            dirty ? 'hover:cursor-pointer text-gray-400' : ''
          } rounded-l-md p-1 ${
            mode == 'list'
              ? 'bg-content dark:bg-contentDark'
              : 'hover:bg-navigationHover dark:hover:bg-navigationHoverDark border-r border-navigationBorder dark:border-navigationBorderDark'
          }`}
          onClick={(e) => setMode('list')}
        >
          <ListIcon></ListIcon>List
        </button>
      )}
      <button
        disabled={!currentRecord}
        className={`w-full flex gap-1 items-center mb-1  ${
          !currentRecord ? 'text-gray-400 hover:cursor-default' : 'hover:cursor-pointer'
        } ${
          mode == 'details'
            ? 'bg-content dark:bg-contentDark'
            : 'hover:bg-navigationHover dark:hover:bg-navigationHoverDark border-r border-navigationBorder dark:border-navigationBorderDark'
        } rounded-l-md p-1`}
        onClick={(e) => setMode('details')}
      >
        <PencilIcon></PencilIcon>Details
      </button>
      <div className='w-full border-b-2 border-r border-navigationBorder dark:border-navigationBorderDark'></div>
      <div className='border-r border-navigationBorder dark:border-navigationBorderDark'>
        {EntitySchemaService.getRelations(schemaRoot, entitySchema, false).map((er) => (
          <button
            key={er.primaryNavigationName}
            disabled={!currentRecord || dirty}
            className={`w-full flex gap-1 items-center hover:text-blue-600 dark:hover:text-blue-200   ${
              !currentRecord || dirty
                ? 'text-gray-400 hover:cursor-default'
                : 'hover:cursor-pointer'
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
    </div>
  )
}

export default StructureNavigation
