import React, { useState } from 'react'
import { activateItem, getItemState, MenuItem, MenuState } from './Menu'
import ChevronRightIcon from '../_Icons/ChevronRightIcon'
import Dropdown from '../_Atoms/Dropdown'
import ChevrodnDownIcon from '../_Icons/ChevrodnDownIcon'

const VerticalMenu: React.FC<{
  menuItems: MenuItem[]
  menuState: MenuState
  className?: string
  menuItemHoverClassName?: string
  onMenuStateChanged: (ms: MenuState) => void
  styleType?: number
}> = ({
  menuItems,
  menuState,
  onMenuStateChanged,
  className,
  menuItemHoverClassName,
  styleType = 0,
}) => {
  return (
    <VerticalMenuInternal
      menuItems={menuItems}
      depth={0}
      menuState={menuState}
      onMenuStateChanged={onMenuStateChanged}
      className={className}
      menuItemHoverClassName={menuItemHoverClassName}
      isSubMenuActive={false}
      setSubMenuInactive={() => {}}
      styleType={styleType}
    ></VerticalMenuInternal>
  )
}

const VerticalMenuInternal: React.FC<{
  menuItems: MenuItem[]
  depth: number
  onMenuStateChanged: (menuState: MenuState) => void
  menuState: MenuState
  className?: string
  menuItemHoverClassName?: string
  isSubMenuActive: boolean
  setSubMenuInactive: () => void
  styleType: number
}> = ({
  menuItems,
  depth,
  onMenuStateChanged,
  menuState,
  className,
  menuItemHoverClassName,
  isSubMenuActive,
  setSubMenuInactive,
  styleType,
}) => {
  function onToggleFolderCollapse(itemId: string) {
    menuState.menuItemStateById[itemId].collapsed = !menuState.menuItemStateById[itemId].collapsed
    onMenuStateChanged({ ...menuState })
  }
  const [activeSubMenuItem, setActiveSubMenuItem] = useState<MenuItem | null>(null)
  console.log('activeSubMenuItem', activeSubMenuItem)
  return (
    <ul
      className={`select-none text-sm  rounded-sm border-0 border-red-400 ${
        styleType == 0 ? 'pl-1' : ''
      }  h-full overflow-auto flex flex-col ${className ? className : 'bg-menu dark:bg-menuDark'}`}
    >
      {menuItems.map((mi: MenuItem) => (
        <div key={mi.id}>
          <li
            style={{
              marginLeft: `${depth}rem`,
              zIndex: isSubMenuActive || activeSubMenuItem ? 51 : 0,
            }}
            key={mi.id}
            id={mi.id}
            className={`relative flex items-center gap-x-4 py-3 px-6 border-0
               ${styleType == 0 ? 'rounded-l-lg' : 'rounded-none'}
               ${
                 mi.type !== 'Group'
                   ? (menuItemHoverClassName && menuItemHoverClassName !== ''
                       ? menuItemHoverClassName
                       : ' ') + ' cursor-pointer'
                   : ''
               } ${mi.type == 'Command' ? 'mt-0' : 'mt-4 font-bold'} ${
              menuState.activeItemId == mi.id
                ? 'bg-prim2 dark:bg-prim2Dark border-r-2 border-texttwo dark:border-menuBorderDark'
                : 'hover:bg-menuHover dark:hover:bg-menuHoverDark'
            }`}
            onClick={() => {
              if (mi.type == 'Folder') {
                onToggleFolderCollapse(mi.id)
                if (mi.selectable) {
                  menuState.activeItemId = mi.id
                }
                onMenuStateChanged({ ...menuState })
                setActiveSubMenuItem(null)
                setSubMenuInactive()
              }
              if (mi.type == 'Command') {
                activateItem(mi, menuState)
                if (mi.selectable) {
                  menuState.activeItemId = mi.id
                }
                setActiveSubMenuItem(null)
                setSubMenuInactive()
                onMenuStateChanged({ ...menuState })
              }
            }}
            onMouseEnter={() => {
              if (mi.type == 'SubMenu') {
                setActiveSubMenuItem(mi)
              }
            }}
          >
            {mi.icon && <span className='text-2xl block float-left'>{mi.icon}</span>}
            <span
              className={`flex-1 border-0 ${
                mi.type == 'Command'
                  ? 'text-sm font-medium text-texttwo dark:text-texttwodark'
                  : 'font-bold text-base'
              }`}
            >
              {mi.label}
            </span>
            {mi.type == 'Folder' && (
              <ChevronRightIcon
                size={1.2}
                strokeWidth={2.5}
                rotate={getItemState(menuState!, mi.id).collapsed ? 0 : 90}
              />
            )}

            {mi.type == 'SubMenu' && <ChevronRightIcon size={1.0} strokeWidth={4} rotate={0} />}
          </li>

          {mi.type == 'Group' && (
            <VerticalMenuInternal
              menuItems={mi.children!}
              depth={depth + 1}
              menuState={menuState}
              onMenuStateChanged={onMenuStateChanged}
              isSubMenuActive={activeSubMenuItem != null || isSubMenuActive}
              setSubMenuInactive={() => setActiveSubMenuItem(null)}
              styleType={styleType}
            ></VerticalMenuInternal>
          )}

          {mi.type == 'Folder' && !getItemState(menuState!, mi.id).collapsed && (
            <VerticalMenuInternal
              menuItems={mi.children!}
              depth={depth + 1}
              menuState={menuState}
              onMenuStateChanged={onMenuStateChanged}
              isSubMenuActive={activeSubMenuItem != null || isSubMenuActive}
              setSubMenuInactive={() => setActiveSubMenuItem(null)}
              styleType={styleType}
            ></VerticalMenuInternal>
          )}
        </div>
      ))}
      {activeSubMenuItem && (
        <>
          <Dropdown
            refId={activeSubMenuItem.id}
            setIsOpen={(o) => {
              setActiveSubMenuItem(null)
            }}
            direction={'x'}
          >
            <div className='border-0 border-menuBorderDark'>
              <VerticalMenuInternal
                menuItems={activeSubMenuItem.children!}
                depth={0}
                menuState={menuState}
                onMenuStateChanged={onMenuStateChanged}
                isSubMenuActive={activeSubMenuItem != null || isSubMenuActive}
                setSubMenuInactive={() => setActiveSubMenuItem(null)}
                styleType={1}
              ></VerticalMenuInternal>
            </div>
          </Dropdown>
        </>
      )}
      <div className='mb-2'></div>
    </ul>
  )
}

export default VerticalMenu
