import React, { useEffect, useState } from 'react'
import { ColorMode, loadShellSettings } from '../components/shell-layout/ShellSettings'
import XMark from '../components/shell-layout/_Icons/XMark'

export class TabItem {
  id: string = ''
  tag: any | undefined
  title: string = ''
  canClose: boolean = true
  renderMethod?: () => JSX.Element
}

const TabControl: React.FC<{
  tabItems: TabItem[]
  initialActiveTabIndex: number
  onTabClose: (tab: TabItem) => void
  onTabChange: (tab: TabItem, tabIndex: number) => void
}> = ({ tabItems, initialActiveTabIndex, onTabClose, onTabChange }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(initialActiveTabIndex)
  // function onTabChange(tabId: string) {
  //   onTabChange(tab)
  //   setActiveTabIndex(tabItems.findIndex((ti) => ti.id == tabId));
  // }

  useEffect(() => {
    setActiveTabIndex(initialActiveTabIndex)
  }, [initialActiveTabIndex])

  const shellSettings = loadShellSettings()

  return (
    <div className='bg-tabBg dark:bg-tabBgDark h-full m-0 flex flex-col w-screen border1-4 border-pink-600'>
      <div className='flex justify-stretch min-w-0'>
        {tabItems.map((ti, index) => (
          <div
            style={
              shellSettings.colorMode == ColorMode.Dark
                ? {
                    borderLeftColor: 'var(--color-background-three-dark)',
                    borderRightColor: 'var(--color-background-three-dark)',
                  }
                : {
                    borderLeftColor: 'var(--color-background-six)',
                    borderRightColor: 'var(--color-background-six)',
                  }
            }
            key={ti.id}
            className={`px-2 py-1 -rounded-b-sm flex justify-between border-r ${
              index == activeTabIndex
                ? 'bg-tabSelected dark:bg-tabSelectedDark border-t-4 border-prim3 dark:border-prim6 border-l-bg3dark'
                : 'bg-tab dark:bg-tabDark hover:bg-tabHover dark:hover:bg-tabHoverDark border-tabBorder dark:border-tabBorderDark border-t-0 border-b'
            } cursor-default`}
          >
            <button className='whitespace-nowrap pl-2 pr-4' onClick={(e) => onTabChange(ti, index)}>
              {ti.title}
            </button>
            {ti.canClose && (
              <button
                className='hover:bg-backgroundtwo dark:hover:bg-backgroundtwodark'
                onClick={(e) => onTabClose(ti)}
              >
                <XMark size={4}></XMark>
              </button>
            )}
          </div>
        ))}
        <div className='border-b border-tabBorder dark:border-tabBorderDark w-full'></div>
      </div>
      <div className='h-full bg-backgroundone dark:bg-backgroundonedark flex flex-col'>
        {tabItems[activeTabIndex]?.renderMethod && tabItems[activeTabIndex]?.renderMethod!()}
      </div>
    </div>
  )
}

export default TabControl
