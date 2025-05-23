import React, { useState } from 'react'
import { MenuItem, ShellMenu } from '../ShellMenu'
import ChevronDown from '../_Icons/ChevronDown'
import {
  ShellMenuState,
  activateItem,
  getItemState,
  loadShellMenuStates,
  toggleFolderCollapse,
} from '../ShellMenuState'
import ChevronRightIcon from '../../../_Icons/ChevronRightIcon'

const VerticalMenu: React.FC<{
  shellMenu: ShellMenu
  menuItems: MenuItem[]
  shellMenuState: ShellMenuState
  className?: string
  menuItemHoverClassName?: string
  filter?: string
}> = ({ shellMenu, menuItems, shellMenuState, className, menuItemHoverClassName, filter }) => {
  const [, setRerenderTrigger] = useState(0)
  // const [shellMenuState] = useState<ShellMenuState>(loadShellMenuState())

  function triggerRerender() {
    setRerenderTrigger((t) => t + 1)
  }

  function getFilteredItems(items: MenuItem[]): MenuItem[] {
    const result: MenuItem[] = []
    if (!filter || filter === '') {
      return items
    }
    items.forEach((mi) => {
      const filteredSubItems: MenuItem[] = mi.children ? getFilteredItems(mi.children) : []
      if (filteredSubItems.length > 0) {
        const newMi: MenuItem = { ...mi, children: filteredSubItems }
        result.push(newMi)
      } else {
        if (mi.label.toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
          result.push(mi)
        }
      }
    })
    return result
  }

  return (
    <div className='mx-3'>
      <VerticalMenuInternal
        menuItems={getFilteredItems(menuItems)}
        shellMenu={shellMenu}
        depth={0}
        triggerRerender={triggerRerender}
        shellMenuState={shellMenuState}
        className={className}
        menuItemHoverClassName={menuItemHoverClassName}
      ></VerticalMenuInternal>
    </div>
  )
}

const VerticalMenuInternal: React.FC<{
  menuItems: MenuItem[]
  shellMenu: ShellMenu
  depth: number
  triggerRerender: () => void
  shellMenuState: ShellMenuState
  className?: string
  menuItemHoverClassName?: string
}> = ({
  menuItems,
  shellMenu,
  depth,
  triggerRerender,
  shellMenuState,
  className,
  menuItemHoverClassName,
}) => {
  function onToggleFolderCollapse(itemId: string) {
    toggleFolderCollapse(shellMenuState!, itemId).then((newState: ShellMenuState) => {
      // setShellMenuState(newState);
      triggerRerender()
    })
  }

  // const depthCssClass = getDepthCssClass(depth)

  return (
    <ul className={`select-none text-sm ${className ? className : 'bg-menu dark:bg-menuDark'}`}>
      {menuItems.map((mi: MenuItem) => (
        <div key={mi.id} style={{}}>
          <li
            key={mi.id}
            style={{
              borderRadius: '0.25rem',
              paddingTop: '0.70rem',
              paddingBottom: '0.70rem',
              paddingLeft: (depth + 1) * 20,
            }}
            className={`flex items-center gap-x-4  px-6  ${
              mi.type !== 'Group'
                ? (menuItemHoverClassName && menuItemHoverClassName !== ''
                    ? menuItemHoverClassName
                    : ' ') + ' cursor-pointer'
                : ''
            } ${mi.type == 'Command' ? 'mt-0' : 'mt-4 font-bold'} ${
              shellMenuState.activeItemId == mi.id
                ? 'bg-menuSelected dark:bg-menuSelectedDark border-0 border-prim4 dark:border-menuBorderDark'
                : 'hover:bg-menuHover dark:hover:bg-menuHoverDark'
            }`}
            onClick={() => {
              if (mi.type == 'Folder') {
                onToggleFolderCollapse(mi.id)
              }
              if (mi.type == 'Command') {
                activateItem(mi, shellMenu, shellMenuState)
              }
              triggerRerender()
            }}
          >
            {mi.icon && <span className='text-2xl block float-left'>{mi.icon}</span>}
            <span
              className={`flex-1 ${
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
                rotate={getItemState(shellMenuState!, mi.id).collapsed ? 0 : 90}
              />
            )}
          </li>

          {mi.type == 'Group' && (
            <VerticalMenuInternal
              menuItems={mi.children!}
              shellMenu={shellMenu}
              depth={depth + 1}
              triggerRerender={triggerRerender}
              shellMenuState={shellMenuState}
            ></VerticalMenuInternal>
          )}

          {mi.type == 'Folder' && !getItemState(shellMenuState!, mi.id).collapsed && (
            <VerticalMenuInternal
              menuItems={mi.children!}
              shellMenu={shellMenu}
              depth={depth + 1}
              triggerRerender={triggerRerender}
              shellMenuState={shellMenuState}
            ></VerticalMenuInternal>
          )}
        </div>
      ))}
    </ul>
  )
}

export default VerticalMenu

function getDepthCssClass(depth: number) {
  let depthCssClass = 'ml-0'
  switch (depth) {
    case 1:
      depthCssClass = 'ml-2'
      break
    case 2:
      depthCssClass = 'ml-4'
      break
    case 3:
      depthCssClass = 'ml-8'
      break
  }
  return depthCssClass
}
