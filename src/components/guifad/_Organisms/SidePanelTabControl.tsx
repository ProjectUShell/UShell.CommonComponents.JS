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

const SidePanelTabControl: React.FC<{
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
    <>
      {mode == 'tab' && (
        <TabControl
          initialActiveTabIndex={1}
          onTabChange={() => {}}
          styleType={0}
          classNameContainerBg='bg-navigation dark:bg-navigationDark'
          // classNameActiveBg='bg-menu dark:bg-menuDark'
          // classNameInactiveBg='bg-content dark:bg-contentDark'
          // classNameHoverBg='hover:bg-contentHover dark:hover:bg-contentHoverDark'
          tabItems={[
            {
              canClose: false,
              title: (
                <div className='flex items-center gap-1 p-0'>
                  <ListIcon size={1.3} strokeWidth={2}></ListIcon> Stack
                </div>
              ),
              id: 'Stack',
              tag: null,
              renderMethod: () => {
                return (
                  <div className='flex flex-col h-full border-t border-navigationBorder dark:border-navigationBorderDark'>
                    Stack
                  </div>
                )
              },
            },
            {
              canClose: false,
              title: (
                <div className='flex items-center gap-1 p-0'>
                  <StructureIcon size={1.3} strokeWidth={2}></StructureIcon> Structure
                  <button
                    className=' mx-1 p-0 rounded-md hover:text-blue-800 dark:hover:text-blue-200'
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      setMode('split')
                    }}
                  >
                    <ArrowRightStartOnRectangle
                      size={1.3}
                      strokeWidth={2}
                    ></ArrowRightStartOnRectangle>
                  </button>
                </div>
              ),
              id: 'Structure',
              tag: null,
              renderMethod: () => {
                return (
                  <div className='flex flex-col h-full border-t border-navigationBorder dark:border-navigationBorderDark'>
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
              },
            },
          ]}
          onTabClose={() => {}}
        ></TabControl>
      )}
      {mode == 'split' && <div>Stack</div>}
    </>
  )
}

export default SidePanelTabControl
