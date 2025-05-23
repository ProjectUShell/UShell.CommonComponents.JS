import React, { createRef, useState } from 'react'
import { MenuItem, ShellMenu } from '../ShellMenu'
import ChevronDown from '../_Icons/ChevronDown'
import Dropdown from '../../../_Atoms/Dropdown'
import VerticalMenu from './VerticalMenu'
import { ShellMenuState, activateItem, loadShellMenuStates } from '../ShellMenuState'

const HorizontalMenu: React.FC<{
  menuItems: MenuItem[]
  shellMenu: ShellMenu
  shellMenuState: ShellMenuState
}> = ({ menuItems, shellMenu, shellMenuState }) => {
  const [openStateById, setOpenStateById] = useState<{ [id: string]: boolean }>({})
  // const [shellMenuState] = useState<ShellMenuState>(loadShellMenuState())

  function setiIsOpen(id: string, isOpen: boolean) {
    const newIsOpenState: { [id: string]: boolean } = {}
    newIsOpenState[id] = isOpen
    setOpenStateById(newIsOpenState)
  }

  return (
    <div className='flex items-center text-sm select-none'>
      {menuItems
        .filter((mi) => mi.type == 'Command')
        .map((mi) => (
          <div key={mi.id}>
            <div
              className='flex items-center justify-between px-2 py-3 hover:bg-red-400 dark:hover:bg-red-400 cursor-pointer'
              onClick={(e) => activateItem(mi, shellMenu, shellMenuState)}
            >
              <div className='px-1'>{mi.label}</div>
            </div>
          </div>
        ))}
      {menuItems
        .filter((mi) => mi.type != 'Command')
        .map((mi: MenuItem) => {
          const buttonRef: any = createRef()
          return (
            <div key={mi.id}>
              <div
                style={{ zIndex: 51 }}
                id={mi.id}
                ref={buttonRef}
                className={`relative flex items-center justify-between text-texttwo text-sm font-medium 
                px-2 py-2  hover:text-textone   hover:bg-menuHover dark:hover:bg-menuHoverDark cursor-pointer ${
                  mi.children && openStateById[mi.id]
                    ? 'bg-menu dark:bg-menuDark text-textone dark:text-textonedark border-l-2 border-prim4 dark:border-prim6'
                    : 'border-l-2 border-menu dark:border-menuDark dark:text-textonedark'
                }`}
                onClick={() => {
                  setiIsOpen(mi.id, true)
                }}
                onMouseEnter={() => {
                  let oneIsOpen: boolean = false
                  for (let k in openStateById) {
                    if (openStateById[k]) {
                      oneIsOpen = true
                      break
                    }
                  }
                  if (oneIsOpen) {
                    setiIsOpen(mi.id, true)
                  }
                }}
              >
                <div className='px-1'> {mi.label}</div>
                {mi.children && <ChevronDown size={4} strokeWidth={2.5}></ChevronDown>}
              </div>
              {mi.children && openStateById[mi.id] && (
                <Dropdown
                  setIsOpen={() => {
                    setiIsOpen(mi.id, false)
                  }}
                  className='bg-menuHover dark:bg-menuHoverDark rounded-sm1'
                  minWidth={true}
                  refId={mi.id}
                >
                  <div
                    className='bg-menu dark:bg-menuDark w-full py-2
                     border-l-2 border-l-prim3 dark:border-l-prim6 dark:border-menuBorderDark
                     border-b-0 border-r-0 shadow-lg shadow-bg6 dark:shadow-black '
                  >
                    <div
                      onClick={() => {
                        openStateById[mi.id] = false
                      }}
                    >
                      <VerticalMenu
                        shellMenu={shellMenu}
                        menuItems={mi.children}
                        shellMenuState={shellMenuState}
                        // className='bg-menu dark:bg-menuDark border border-menuBorder dark:border-menuBorderDark'
                        // menuItemHoverClassName='hover:bg-menuHover1 dark:hover:bg-menuHover1Dark'
                      ></VerticalMenu>
                    </div>
                  </div>
                </Dropdown>
              )}
            </div>
          )
        })}
    </div>
  )
}

export default HorizontalMenu
