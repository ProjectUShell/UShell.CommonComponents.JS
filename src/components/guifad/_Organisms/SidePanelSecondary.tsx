import { RelationSchema } from 'fusefx-modeldescription'
import React from 'react'
import PreviewTable from './PreviewTable'
import StructureNavigation2000 from './StructureNavigation2000'
import { IDataSource, IDataSourceManagerWidget } from 'ushell-modulebase'
import { LayoutDescriptionRoot } from '../../../[Move2LayoutDescription]/LayoutDescriptionRoot'
import TabControl from '../../../_Organisms/TabControl'
import EntityStructureControl from './EntityStructureControl'
import StructureIcon from '../../../_Icons/StructureIcon'
import ListIcon from '../../../_Icons/ListIcon'
import { SPLITTER } from 'styled-components/dist/constants'
import ArrowRightStartOnRectangle from '../../../_Icons/ArrowRightStartOnRectangle'

const SidePanelSecondary: React.FC<{
  dataSourceManager: IDataSourceManagerWidget
  currentRecord: any
  dataSource: IDataSource
  enterRelation: (rel: RelationSchema, record: any) => void
  dirty: boolean
  layoutDescription: LayoutDescriptionRoot
  classNameAsideBorder: string
  mode: 'tab' | 'split'
  setMode: (mode: 'tab' | 'split') => void
}> = ({
  dataSourceManager,
  currentRecord,
  dataSource,
  enterRelation,
  dirty,
  layoutDescription,
  classNameAsideBorder,
  mode,
  setMode,
}) => {
  return (
    <div className='flex flex-col h-full'>
      <div className='flex items-center gap-1 p-3.5 border-b border-navigationBorder dark:border-navigationBorderDark'>
        <button
          onClick={() => setMode('tab')}
          className='flex items-center gap-1 hover:text-blue-800 dark:hover:text-blue-200'
        >
          <ArrowRightStartOnRectangle
            rotate={180}
            size={1.2}
            strokeWidth={2}
          ></ArrowRightStartOnRectangle>
        </button>
        <div>Structure</div>
      </div>
      <EntityStructureControl
        dataSourceManager={dataSourceManager}
        currentRecord={currentRecord}
        dataSource={dataSource}
        enterRelation={enterRelation}
        dirty={dirty}
        layoutDescription={layoutDescription}
        classNameAsideBorder={classNameAsideBorder}
      ></EntityStructureControl>
    </div>
  )
}

export default SidePanelSecondary
