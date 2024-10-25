import React, { Children, useEffect, useState } from 'react'
import { ColorMode, loadShellSettings } from '../components/shell-layout/ShellSettings'
import XMark from '../components/shell-layout/_Icons/XMark'

export class TabItem {
  id: string = ''
  tag: any | undefined
  title: string = ''
  canClose: boolean = true
  renderMethod?: () => JSX.Element
}

export const TabControl1: React.FC<{
  tabItems: TabItem[]
  onTabClose: (tab: TabItem) => void
  classNameContainerBg?: string
  classNameActiveBg?: string
  classNameInactiveBg?: string
  classNameHoverBg?: string
  styleType?: number
}> = ({
  tabItems,
  onTabClose,
  classNameContainerBg,
  styleType = 0,
  classNameInactiveBg = '',
  classNameActiveBg,
  classNameHoverBg,
}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  return (
    <TabControl
      initialActiveTabIndex={activeTabIndex}
      onTabChange={(t, i) => setActiveTabIndex(i)}
      onTabClose={onTabClose}
      tabItems={tabItems}
      classNameContainerBg={classNameContainerBg}
      styleType={styleType}
      classNameActiveBg={classNameActiveBg}
      classNameInactiveBg={classNameInactiveBg}
      classNameHoverBg={classNameHoverBg}
    ></TabControl>
  )
}

const TabHeader: React.FC<{
  children: any
  styleType: number
  isActive: boolean
  classNameActive: string
  classNameInactive: string
  classNameHoverBg: string
}> = ({ children, styleType, isActive, classNameActive, classNameInactive, classNameHoverBg }) => {
  if (isActive) {
    if (styleType == 0) {
      return (
        <a
          className={`inline-block min-w-20 py-3 px-2 rounded-t-lg cursor-pointer select-none whitespace-nowrap
            font-bold border-b-2 border-blue-400`}
        >
          {children}
        </a>
      )
    } else {
      return (
        <a
          className={`inline-block min-w-20 py-2 px-1 rounded-t-lg cursor-pointer select-none whitespace-nowrap
          ${classNameActive}`}
        >
          <div className='p-1'>{children}</div>
        </a>
      )
    }
  } else {
    if (styleType == 0) {
      return (
        <a
          className={`inline-block min-w-20 py-3 px-2 rounded-t-lg cursor-pointer select-none whitespace-nowrap
            hover:border-b-2 border-menuBorder dark:border-menuBorderDark`}
        >
          {children}
        </a>
      )
    } else {
      return (
        <a
          className={`inline-block min-w-20 py-2 px-1 rounded-t-lg cursor-pointer select-none whitespace-nowrap
            ${classNameInactive}  `}
        >
          <div className={`${classNameHoverBg} rounded-md p-1`}>{children}</div>
        </a>
      )
    }
  }
}

const TabControl: React.FC<{
  tabItems: TabItem[]
  initialActiveTabIndex: number
  onTabClose: (tab: TabItem) => void
  onTabChange: (tab: TabItem, idx: number) => void
  classNameContainerBg?: string
  classNameActiveBg?: string
  classNameInactiveBg?: string
  classNameHoverBg?: string
  styleType?: number
}> = ({
  tabItems,
  initialActiveTabIndex,
  onTabClose,
  onTabChange,
  classNameContainerBg,
  classNameActiveBg,
  classNameInactiveBg,
  classNameHoverBg,
  styleType = 0,
}) => {
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
    <div
      className={`USHell_TabContainer h-full flex flex-col w-full overflow-hidden border-0 border-red-400
     ${classNameContainerBg || 'bg-menu dark:bg-menuDark'} `}
    >
      <ul
        className={`UShell_TabBar flex flex-wrap text-sm font-medium text-center
           border-menuBorder dark:border-menuBorderDark  -mb-px ${classNameInactiveBg || ''}
          ${styleType == 0 ? 'border-b-2' : ''}`}
      >
        {tabItems.map((ti, index) => (
          <li
            key={ti.id}
            // className={`px-2 py-1 -rounded-b-sm flex justify-between border1-x cursor-default font-medium
            className={`me-1 `}
          >
            <div onClick={() => setActiveTabIndex(index)}>
              <TabHeader
                isActive={index == activeTabIndex}
                styleType={styleType}
                classNameActive={classNameActiveBg || ''}
                classNameInactive={classNameInactiveBg || ''}
                classNameHoverBg={classNameHoverBg || ''}
              >
                <p>{ti.title}</p>
              </TabHeader>
            </div>
            {ti.canClose && (
              <button
                className='hover:bg-backgroundtwo dark:hover:bg-backgroundtwodark'
                onClick={(e) => onTabClose(ti)}
              >
                <XMark size={4}></XMark>
              </button>
            )}
          </li>
        ))}
        {/* <div className="border-b border-bg6 dark:border-bg3dark w-full"></div> */}
      </ul>
      <div className='h-full flex flex-col mt-0 border-0 border-blue-400 overflow-hidden'>
        {tabItems[activeTabIndex]?.renderMethod && tabItems[activeTabIndex]?.renderMethod!()}
      </div>
    </div>
  )
}

export default TabControl
