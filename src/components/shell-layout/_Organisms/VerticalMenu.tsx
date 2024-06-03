import React, { useState } from 'react'
import { MenuItem } from '../ShellMenu'
import ChevronDown from '../_Icons/ChevronDown'
import {
  ShellMenuState,
  activateItem,
  getItemState,
  loadShellMenuState,
  toggleFolderCollapse,
} from '../ShellMenuState'

const VerticalMenu: React.FC<{
  menuItems: MenuItem[]
  shellMenuState: ShellMenuState
  className?: string
  menuItemHoverClassName?: string
}> = ({ menuItems, shellMenuState, className, menuItemHoverClassName }) => {
  const [, setRerenderTrigger] = useState(0)
  // const [shellMenuState] = useState<ShellMenuState>(loadShellMenuState())

  function triggerRerender() {
    setRerenderTrigger((t) => t + 1)
  }

  console.log('shellMenuState v', shellMenuState)

  return (
    <VerticalMenuInternal
      menuItems={menuItems}
      depth={0}
      triggerRerender={triggerRerender}
      shellMenuState={shellMenuState}
      className={className}
      menuItemHoverClassName={menuItemHoverClassName}
    ></VerticalMenuInternal>
  )
}

const VerticalMenuInternal: React.FC<{
  menuItems: MenuItem[]
  depth: number
  triggerRerender: () => void
  shellMenuState: ShellMenuState
  className?: string
  menuItemHoverClassName?: string
}> = ({ menuItems, depth, triggerRerender, shellMenuState, className, menuItemHoverClassName }) => {
  function onToggleFolderCollapse(itemId: string) {
    toggleFolderCollapse(shellMenuState!, itemId).then((newState: ShellMenuState) => {
      // setShellMenuState(newState);
      triggerRerender()
    })
  }

  const depthCssClass = getDepthCssClass(depth)

  return (
    <ul className={`select-none text-sm  rounded-md ${className ? '' : ''}`}>
      {menuItems.map((mi: MenuItem) => (
        <div key={mi.id}>
          <li
            key={mi.id}
            className={`flex items-center gap-x-4 py-2 px-6 rounded-as ${depthCssClass} ${
              mi.type !== 'Group'
                ? (menuItemHoverClassName && menuItemHoverClassName !== ''
                    ? menuItemHoverClassName
                    : ' ') + ' cursor-pointer'
                : ''
            } ${mi.type == 'Command' ? 'mt-0 font-light' : 'mt-4 font-bold'} ${
              shellMenuState.activeItemId == mi.id
                ? 'bg-prim1 dark:bg-prim6 border-r-2 border-textone dark:border-textonedark'
                : 'hover:bg-bg3 dark:hover:bg-bg2dark'
            }`}
            onClick={() => {
              if (mi.type == 'Folder') {
                onToggleFolderCollapse(mi.id)
              }
              if (mi.type == 'Command') {
                activateItem(mi, shellMenuState)
              }
              triggerRerender()
            }}
          >
            {mi.icon && <span className='text-2xl block float-left'>{mi.icon}</span>}
            <span className={`flex-1`}>{mi.label}</span>
            {mi.type == 'Folder' && <ChevronDown />}
          </li>

          {mi.type == 'Group' && (
            <VerticalMenuInternal
              menuItems={mi.children!}
              depth={depth + 1}
              triggerRerender={triggerRerender}
              shellMenuState={shellMenuState}
            ></VerticalMenuInternal>
          )}

          {mi.type == 'Folder' && !getItemState(shellMenuState!, mi.id).collapsed && (
            <VerticalMenuInternal
              menuItems={mi.children!}
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
