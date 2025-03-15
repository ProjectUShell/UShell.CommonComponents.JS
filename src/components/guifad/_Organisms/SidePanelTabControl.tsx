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

const SidePanelTabControl: React.FC<{
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
    <TabControl
      initialActiveTabIndex={0}
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
            <div className='flex items-center gap-1'>
              <StructureIcon size={1} strokeWidth={2}></StructureIcon> Structure
            </div>
          ),
          id: 'Structure',
          tag: null,
          renderMethod: () => {
            return (
              <EntityStructureControl
                dataSourceManager={dataSourceManager}
                currentRecord={currentRecord}
                dataSource={dataSource}
                enterRelation={enterRelation}
                dirty={dirty}
                layoutDescription={layoutDescription}
                classNameAsideBorder={classNameAsideBorder}
              ></EntityStructureControl>
            )
          },
        },
        {
          canClose: false,
          title: (
            <div className='flex items-center gap-1'>
              <ListIcon size={1.1} strokeWidth={2}></ListIcon> Stack
            </div>
          ),
          id: 'Stack',
          tag: null,
          renderMethod: () => {
            return <></>
          },
        },
      ]}
      onTabClose={() => {}}
    ></TabControl>
  )
}

export default SidePanelTabControl
