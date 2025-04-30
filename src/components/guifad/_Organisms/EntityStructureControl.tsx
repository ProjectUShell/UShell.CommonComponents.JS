import { RelationSchema } from 'fusefx-modeldescription'
import React from 'react'
import PreviewTable from './PreviewTable'
import StructureNavigation2000 from './StructureNavigation2000'
import { IDataSource, IDataSourceManagerWidget } from 'ushell-modulebase'
import { LayoutDescriptionRoot } from '../../../[Move2LayoutDescription]/LayoutDescriptionRoot'
import TabControl from '../../../_Organisms/TabControl'

const EntityStructureControl: React.FC<{
  dataSourceManager: IDataSourceManagerWidget
  currentRecord: any
  dataSource: IDataSource
  enterRelation: (rel: RelationSchema, record: any) => void
  dirty: boolean
  layoutDescription: LayoutDescriptionRoot
  classNameAsideBorder: string
}> = ({
  dataSourceManager,
  currentRecord,
  dataSource,
  enterRelation,
  dirty,
  layoutDescription,
  classNameAsideBorder,
}) => {
  return (
    <>
      <div className='border-b h-full bg-navigation dark:bg-navigationDark border-navigationBorder dark:border-navigationBorderDark'>
        <StructureNavigation2000
          dataSourceManager={dataSourceManager}
          dataSource={dataSource}
          schemaRoot={dataSourceManager.getSchemaRoot()}
          currentRecord={currentRecord}
          entitySchema={dataSource.entitySchema!}
          onRelationEnter={(rel: RelationSchema) => enterRelation(rel, null)}
          className='w-full h-1/2123 '
          dirty={dirty}
          entityLayout={layoutDescription.entityLayouts.find(
            (el) => el.entityName == dataSource.entitySchema?.name,
          )}
          classNameBorder={classNameAsideBorder}
        ></StructureNavigation2000>
      </div>
    </>
  )
}

export default EntityStructureControl
