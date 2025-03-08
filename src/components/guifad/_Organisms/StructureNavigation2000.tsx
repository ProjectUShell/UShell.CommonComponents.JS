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

const StructureNavigation2000: React.FC<{
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
  classNameBorder?: string
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
  classNameBorder = 'border-navigationBorder dark:border-navigationBorderDark',
}) => {
  function getNavigationDiplayLabel(er: RelationSchema) {
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
    <div className={`p-0.5 border-0 flex flex-col ${classNameBorder}  text-sm ${className}`}>
      <h1 className={`p-2 font-bold whitespace-normal`}>{entitySchema.name}</h1>
      {!hideList && (
        <button
          disabled={dirty}
          style={{ borderRadius: '0.25rem' }}
          className={`w-full flex gap-1 items-center text-sm ${classNameBorder}  ${
            dirty ? 'hover:cursor-pointer text-gray-400' : ''
          } rounded-md p-1 px-2 ${
            mode == 'list'
              ? 'bg-navigationSelected dark:bg-navigationSelectedDark border-r-0 border-l-0 border-t-0 border-b-0'
              : 'hover:bg-navigationHover dark:hover:bg-navigationHoverDark border-r-0'
          }`}
          onClick={(e) => setMode('list')}
        >
          <ListIcon></ListIcon>{' '}
          {currentRecord
            ? entitySchema.name +
              ' ' +
              EntitySchemaService.getLabel(schemaRoot, entitySchema.name, currentRecord)
            : entitySchema.name}
        </button>
      )}

      <div className={`border-0 ${classNameBorder}`}>
        <button
          disabled={!currentRecord}
          style={{ borderRadius: '0.25rem' }}
          className={`pl-7 w-full flex gap-1 items-center mb-1 ${classNameBorder}  ${
            !currentRecord ? 'text-gray-400 hover:cursor-default' : 'hover:cursor-pointer'
          } ${
            mode == 'details'
              ? 'bg-navigationSelected dark:bg-navigationSelectedDark border-r-0 border-l-0 border-t-0 border-b-0 '
              : 'hover:bg-navigationHover dark:hover:bg-navigationHoverDark border-r-0 '
          }  p-1 `}
          onClick={(e) => setMode('details')}
        >
          <PencilIcon></PencilIcon>Details
        </button>
        {EntitySchemaService.getRelations(schemaRoot, entitySchema, false).map((er) => (
          <button
            key={er.primaryNavigationName}
            disabled={!currentRecord || dirty}
            style={{ borderRadius: '0.25rem' }}
            className={`w-full flex gap-1 items-center pl-6  ${
              !currentRecord || dirty
                ? 'text-gray-400 hover:cursor-default'
                : 'hover:cursor-pointer'
            } rounded-md p-1 ${
              currentRelation?.primaryNavigationName == er.primaryNavigationName
                ? !currentRecord || dirty
                  ? ''
                  : 'bg-navigationSelected dark:bg-navigationSelectedDark'
                : 'hover:bg-navigationHover dark:hover:bg-navigationHoverDark border-r-0 '
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

export default StructureNavigation2000
