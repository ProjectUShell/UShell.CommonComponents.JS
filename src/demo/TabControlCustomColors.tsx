import React from 'react'
import TabControl, { TabControl1 } from '../_Organisms/TabControl'

const TabControlCustomColors = () => {
  return (
    <TabControl1
      tabItems={[
        {
          canClose: false,
          id: '1',
          tag: 'Tag 1',
          title: 'Tab 1',
          renderMethod: () => <div className='p-2'>Content of Tab 1</div>,
        },
        {
          canClose: false,
          id: '2',
          tag: 'Tag 2',
          title: 'Tab 2',
          renderMethod: () => <div className='p-2'>Content of Tab 2</div>,
        },
      ]}
      onTabClose={() => {}}
      classNameContainerBg='bg-content dark:bg-contentDark'
    ></TabControl1>
  )
}

export default TabControlCustomColors
