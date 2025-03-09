import React, { useState } from 'react'
import { MenuItem, ShellMenu } from '../ShellMenu'
import Menu from '../_Organisms/Menu'
import { ShellMenuState } from '../ShellMenuState'
import MenuSearchBar from '../_Atoms/MenuSearchBar'
import AppBreadcrumb from '../_Molecules/AppBreadcrumb'

const VerticalShellLayout: React.FC<{
  sidebarOpen: boolean
  menuItems: MenuItem[]
  shellMenu: ShellMenu
  shellMenuState: ShellMenuState
  children: any
  showBreadcrumb?: boolean
  showSearchBar?: boolean
}> = ({
  sidebarOpen,
  menuItems,
  shellMenu,
  shellMenuState,
  children,
  showBreadcrumb,
  showSearchBar,
}) => {
  const [searchFilter, setSearchFilter] = useState('')

  return (
    <div className={`flex overflow-hidden h-screen whitespace-nowrap`}>
      {/* Sidebar */}

      {menuItems.length > 0 && (
        <div
          className={`fixed lg:static flex flex-col z-10 top-10 bottom-0 left-0
          bg-menu dark:bg-menuDark border-r border-menuBorder dark:border-menuBorderDark overflow-hidden transform ${
            sidebarOpen
              ? 'translate-x-0 w-96  ease-out transition-all duration-200'
              : '-translate-x-0 w-0 ease-in transition-all duration-20'
          }`}
        >
          <MenuSearchBar filter={searchFilter} setFilter={setSearchFilter}></MenuSearchBar>
          <div className='flex flex-col overflow-auto pb-1'>
            <Menu
              menuItems={menuItems}
              shellMenu={shellMenu}
              shellMenuState={shellMenuState}
              direction='Vertical'
              filter={searchFilter}
            ></Menu>
          </div>
        </div>
      )}
      {/* Content */}
      <div className='flex flex-col w-screen h-full overflow-y-hidden border-0 border-blue-400'>
        {showBreadcrumb && (
          <div className=''>
            <AppBreadcrumb shellMenuState={shellMenuState} menuItems={menuItems}></AppBreadcrumb>
          </div>
        )}
        <div
          className='w-full flex h-full min-w-0 
          bg-bg2 dark:bg-bg2dark overflow-hidden border-0 border-red-400'
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default VerticalShellLayout
