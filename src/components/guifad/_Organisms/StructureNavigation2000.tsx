import React, { useState } from 'react'
import { ObjectGraphNode } from '../ObjectGraphNode'
import { EntitySchema, RelationSchema, SchemaRoot } from 'fusefx-modeldescription'
import { EntitySchemaService } from '../../../data/EntitySchemaService'
import ListIcon from '../../../_Icons/ListIcon'
import FolderIcon from '../../shell-layout/_Icons/FolderIcon'
import PencilIcon from '../../../_Icons/PencilIcon'
import { lowerFirstLetter } from '../../../utils/StringUtils'
import { EntityLayout } from '../../../[Move2LayoutDescription]/EntityLayout'
import { FieldLayout } from '../../../[Move2LayoutDescription]/FieldLayout'
import PreviewTable from './PreviewTable'
import { IDataSource, IDataSourceManagerWidget } from 'ushell-modulebase'

const StructureNavigation2000: React.FC<{
  dataSourceManager: IDataSourceManagerWidget
  dataSource: IDataSource
  currentRecord: any
  entitySchema: EntitySchema
  schemaRoot: SchemaRoot
  onRelationEnter: (rel: RelationSchema, record?: any) => void
  className?: string
  dirty: boolean
  entityLayout?: EntityLayout
  classNameBorder?: string
}> = ({
  dataSourceManager,
  dataSource,
  currentRecord,
  entitySchema,
  schemaRoot,
  onRelationEnter,
  className,
  dirty,
  entityLayout,
  classNameBorder = 'border-navigationBorder dark:border-navigationBorderDark',
}) => {
  const [currentRelation, setCurrentRelation] = useState<RelationSchema | null>(null)

  function getNavigationDiplayLabel(er: RelationSchema) {
    if (!entityLayout)
      return er.primaryNavigationName && er.primaryNavigationName != ''
        ? er.primaryNavigationName
        : EntitySchemaService.getLabelForRelationToForeign(schemaRoot, er)
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
    <div
      className={`p-0 h-full border-0 justify-between flex flex-col ${classNameBorder}  text-sm ${className}`}
    >
      <div className={`border-b h-full ${classNameBorder}`}>
        <div className='p-2'>
          <button
            disabled={!currentRecord}
            style={{ borderRadius: '0.25rem' }}
            className={`pl-0 w-full flex gap-1 items-center mb-1 ${classNameBorder}  ${
              !currentRecord ? 'text-gray-400 hover:cursor-default' : 'hover:cursor-pointer'
            } ${
              !currentRelation && currentRecord
                ? 'bg-navigationSelected dark:bg-navigationSelectedDark border-r-0 border-l-0 border-t-0 border-b-0 '
                : 'hover:bg-navigationHover dark:hover:bg-navigationHoverDark border-r-0 '
            }  p-1 `}
            onClick={(e) => setCurrentRelation(null)}
          >
            <PencilIcon></PencilIcon>
            {currentRecord
              ? entitySchema.name +
                ' ' +
                EntitySchemaService.getLabel(schemaRoot, entitySchema.name, currentRecord)
              : entitySchema.name}
          </button>
          {EntitySchemaService.getRelations(schemaRoot, entitySchema, false).map((er) => (
            <button
              key={EntitySchemaService.getKey(er)}
              disabled={!currentRecord || dirty}
              style={{ borderRadius: '0.25rem' }}
              className={`w-full flex gap-1 items-center pl-7  ${
                !currentRecord || dirty
                  ? 'text-gray-400 hover:cursor-default'
                  : 'hover:cursor-pointer'
              } rounded-md p-1 ${
                EntitySchemaService.areRelationsEqual(er, currentRelation)
                  ? !currentRecord || dirty
                    ? ''
                    : 'bg-navigationSelected dark:bg-navigationSelectedDark'
                  : 'hover:bg-navigationHover dark:hover:bg-navigationHoverDark border-r-0 '
              }`}
              onClick={() => setCurrentRelation(er)}
              onDoubleClick={() => {
                onRelationEnter(er)
                setCurrentRelation(null)
              }}
            >
              <FolderIcon></FolderIcon>
              {getNavigationDiplayLabel(er)}
            </button>
          ))}
        </div>
      </div>
      <div className='w-full h-full max-w-full border-0 p-0 border-navigationBorder dark:border-navigationBorderDark'>
        <h1 className='self-start flex justify-start border-0 pt-2 pb-3 pl-4 uppercase text-xs'>
          {currentRelation && currentRecord
            ? getNavigationDiplayLabel(currentRelation)
            : 'Entity Preview'}
        </h1>
        {currentRelation && currentRecord && (
          <PreviewTable
            dataSource={dataSourceManager.tryGetDataSource(currentRelation.foreignEntityName)!}
            onRecordEnter={(r: any) => {
              onRelationEnter(currentRelation, r)
              setCurrentRelation(null)
            }}
            onSelectedRecordsChange={(sr: any[]) => {}}
            parentSchema={dataSource.entitySchema!}
            schemaRoot={dataSourceManager.getSchemaRoot()}
            parent={currentRecord}
          ></PreviewTable>
        )}
        {!currentRelation && currentRecord && <div>Entity Preview</div>}
      </div>
    </div>
  )
}

export default StructureNavigation2000
