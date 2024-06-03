import React from 'react'
import { ShellMenu } from '../ShellMenu'
import Menu from '../_Organisms/Menu'
import { ShellMenuState } from '../ShellMenuState'

const HorizontalShellLayout: React.FC<{
  shellMenu: ShellMenu
  shellMenuState: ShellMenuState
  children: any
}> = ({ shellMenu, shellMenuState, children }) => {
  return (
    <div className={`h-screen flex flex-col overflow-hidden`}>
      <header
        className='flex flex-col z-20 px-6 bg-menu dark:bg-bg0dark
          text-textone dark:text-textonedark shadow-md1 dark:shadow-none1 border-b border-bg6 dark:border-bg3dark'
      >
        {shellMenu.items.length > 0 && (
          <div className='flex justify-between items-center'>
            <Menu
              direction='Horizontal'
              menuItems={shellMenu.items}
              shellMenuState={shellMenuState}
            ></Menu>
          </div>
        )}
      </header>
      <div
        className='w-screen h-full flex min-w-0 
          bg-bg2 text-gray-800 dark:bg-bg2dark dark:text-white overflow-hidden'
      >
        {children}
      </div>
    </div>
  )
}

export default HorizontalShellLayout
