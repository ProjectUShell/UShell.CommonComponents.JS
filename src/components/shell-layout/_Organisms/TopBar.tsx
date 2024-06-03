import React from 'react'
import SettingsDropdown from '../_Molecules/SettingsDropdown'
import { LayoutMode, ColorMode, ShellSettings } from '../ShellSettings'
import { TopBarItem } from '../ShellMenu'

const TopBar: React.FC<{
  layoutMode: LayoutMode
  setLayoutMode: (layoutMode: LayoutMode) => void
  setColorMode: (colorMode: ColorMode) => void
  shellSettings: ShellSettings
  toggleSidebarOpen: () => void
  title: JSX.Element | string
  topBarElements?: TopBarItem[]
}> = ({
  layoutMode,
  setLayoutMode,
  setColorMode,
  toggleSidebarOpen,
  topBarElements,
  title,
  shellSettings,
}) => {
  return (
    <header
      className='static top-0 flex flex-col z-30 px-6 
      bg-topbar dark:bg-topbarDark text-textone dark:text-textonedark shadow-md shadow-topbarshadow1 dark:shadow-none border-b-0 
      dark:border-b border-bg4 dark:border-hairlineMenuDark '
    >
      <div className='flex justify-between items-center py-1'>
        <div className='flex items-center py-2'>
          <h1>{title}</h1>
          {layoutMode == LayoutMode.Vertical && (
            <button className='ml-4' onClick={() => toggleSidebarOpen()}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                />
              </svg>
            </button>
          )}
        </div>

        <div>Search</div>

        <div className='flex items-center gap-1 justify-between py-2'>
          <SettingsDropdown
            shellSettings={shellSettings}
            setLayoutMode={setLayoutMode}
            setColorMode={setColorMode}
          ></SettingsDropdown>
          {topBarElements &&
            topBarElements!.map((e: TopBarItem, index: number) => (
              <div className='align-middle' key={index}>
                {' '}
                {e.icon}
              </div>
            ))}
        </div>
      </div>
    </header>
  )
}

export default TopBar
