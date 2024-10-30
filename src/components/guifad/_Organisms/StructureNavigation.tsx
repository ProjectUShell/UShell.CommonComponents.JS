import React from 'react'
import { ObjectGraphNode } from '../ObjectGraphNode'
import { EntitySchema, RelationSchema, SchemaRoot } from 'fusefx-modeldescription'
import { EntitySchemaService } from '../../../data/EntitySchemaService'
import ListIcon from '../../../_Icons/ListIcon'
import FolderIcon from '../../shell-layout/_Icons/FolderIcon'
import PencilIcon from '../../../_Icons/PencilIcon'
import { lowerFirstLetter } from '../../../utils/StringUtils'
import { EntityLayout } from '../../../[Move2LayoutDescription]/EntityLayout'
import { FieldLayout } from '../../../[Move2LayoutDescription]/FieldLayout'

const StructureNavigation: React.FC<{
  currentRecord: any
  hideList: any
  entitySchema: EntitySchema
  schemaRoot: SchemaRoot
  onRelationSelected: (rel: RelationSchema) => void
  onRelationEnter: (rel: RelationSchema) => void
  setMode: (mode: 'list' | 'details') => void
  mode: 'list' | 'details'
  currentRelation: RelationSchema | null
  className?: string
  dirty: boolean
  entityLayout?: EntityLayout
}> = ({
  currentRecord,
  hideList,
  entitySchema,
  schemaRoot,
  onRelationSelected,
  setMode,
  onRelationEnter,
  mode,
  currentRelation,
  className,
  dirty,
  entityLayout,
}) => {
  function getNavigationDiplayLabel(er: RelationSchema) {
    console.log('getNav Display', entityLayout)
    if (!entityLayout)
      return er.primaryNavigationName && er.primaryNavigationName != ''
        ? er.primaryNavigationName
        : er.foreignEntityName
    const fieldLayout: FieldLayout | undefined = entityLayout.fieldLayouts.find((f) => {
      if (!f.fieldName.includes('.')) return false
      const idxOfDot = f.fieldName.indexOf('.')
      const foreignEntityName: string = f.fieldName.substring(0, idxOfDot)
      const foreignPropertyName: string = f.fieldName.substring(idxOfDot + 1)
      return (
        foreignPropertyName == er.foreignKeyIndexName && foreignEntityName == er.foreignEntityName
      )
    })
    if (!fieldLayout)
      return er.primaryNavigationName && er.primaryNavigationName != ''
        ? er.primaryNavigationName
        : er.foreignEntityName
    return fieldLayout.displayLabel
  }

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
              currentRelation?.primaryNavigationName == er.primaryNavigationName
                ? !currentRecord || dirty
                  ? ''
                  : 'underline'
                : ''
            }`}
            onClick={() => onRelationSelected(er)}
            onDoubleClick={() => onRelationEnter(er)}
          >
            <FolderIcon></FolderIcon>
            {getNavigationDiplayLabel(er)}
          </button>
        ))}
      </div>
    </div>
  )
}

export default StructureNavigation
