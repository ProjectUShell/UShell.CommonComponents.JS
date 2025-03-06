import React from 'react'
import { TopBarTab } from '../_Organisms/TopBar'
import TabControl from '../../../_Organisms/TabControl'

const TopBarTabs: React.FC<{ tabItems: TopBarTab[] }> = ({ tabItems }) => {
  return (
    <TabControl
      initialActiveTabIndex={0}
      onTabChange={(t, i) => {
        console.log('tab change', t, i)
        t.tag.action()
      }}
      onTabClose={() => {}}
      tabItems={tabItems.map((t) => {
        return { label: t.label, canClose: false, id: t.label, tag: t, title: t.label }
      })}
      // classNameInactiveBg='bg-red-400'
      classNameActiveBg='px-4'
      classNameInactiveBg='px-4'
      classNameContainerBg='bg-topbar dark:bg-topbarDark'
      classNameHoverBg='hover:bg-menuHover dark:hover:bg-menuHoverDark'
    ></TabControl>
  )
}

export default TopBarTabs
