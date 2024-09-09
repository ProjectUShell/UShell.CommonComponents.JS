import React, { createRef, useState } from 'react'
import { MenuItem } from '../ShellMenu'
import ChevronDown from '../_Icons/ChevronDown'
import Dropdown from '../../../_Atoms/Dropdown'
import VerticalMenu from './VerticalMenu'
import { ShellMenuState, activateItem, loadShellMenuState } from '../ShellMenuState'

const HorizontalMenu: React.FC<{ menuItems: MenuItem[]; shellMenuState: ShellMenuState }> = ({
  menuItems,
  shellMenuState,
}) => {
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
              onClick={(e) => activateItem(mi, shellMenuState)}
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
                ref={buttonRef}
                className={`relative flex items-center justify-between z-50 
                px-2 py-2  hover:text-textone   hover:bg-menuHover dark:hover:bg-menuHoverDark cursor-pointer ${
                  mi.children && openStateById[mi.id]
                    ? 'bg-menuHover dark:bg-menuHoverDark text-textone dark:text-textonedark border-l-2 border-prim1 dark:border-prim6'
                    : 'border-l-2 border-menu dark:border-menuDark text-texttwo dark:text-textonedark'
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
                {mi.children && <ChevronDown size={4}></ChevronDown>}
              </div>
              {mi.children && openStateById[mi.id] && (
                <Dropdown
                  topOffset={0}
                  rightOffset={0}
                  setIsOpen={() => {
                    setiIsOpen(mi.id, false)
                  }}
                  className='bg-menuHover dark:bg-menuHoverDark rounded-sm'
                  minWidth={true}
                  refId={buttonRef.id}
                >
                  <div
                    className='bg-menuHover dark:bg-menuHoverDark
                     border-l-2 border-prim1 dark:border-prim6 rounded-sm shadow-lg shadow-bg6 dark:shadow-black ronded-b-md'
                  >
                    <div
                      onClick={() => {
                        openStateById[mi.id] = false
                      }}
                    >
                      <VerticalMenu
                        menuItems={mi.children}
                        shellMenuState={shellMenuState}
                        className='bg-menu1 dark:bg-menu1Dark'
                        menuItemHoverClassName='hover:bg-menuHover1 dark:hover:bg-menuHover1Dark'
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
