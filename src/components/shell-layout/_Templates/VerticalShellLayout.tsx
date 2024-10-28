import React from 'react'
import { ShellMenu } from '../ShellMenu'
import Menu from '../_Organisms/Menu'
import { ShellMenuState } from '../ShellMenuState'

const VerticalShellLayout: React.FC<{
  sidebarOpen: boolean
  shellMenu: ShellMenu
  shellMenuState: ShellMenuState
  children: any
}> = ({ sidebarOpen, shellMenu, shellMenuState, children }) => {
  return (
    <div className={`flex overflow-hidden h-screen whitespace-nowrap`}>
      {/* Sidebar */}
      {shellMenu.items.length > 0 && (
        <div
          className={`fixed lg:static z-10 top-10 bottom-0 left-0
          bg-menu dark:bg-menuDark border-r border-menuBorder dark:border-menuBorderDark overflow-auto transform ${
            sidebarOpen
              ? 'translate-x-0 w-96  ease-out transition-all duration-200'
              : '-translate-x-0 w-0 ease-in transition-all duration-20'
          }`}
        >
          <Menu
            menuItems={shellMenu.items}
            shellMenuState={shellMenuState}
            direction='Vertical'
          ></Menu>
        </div>
      )}
      {/* Content */}
      <div
        className='w-screen flex h-full min-w-0 
          bg-bg2 dark:bg-bg2dark overflow-hidden'
      >
        {children}
      </div>
    </div>
  )
}

export default VerticalShellLayout
