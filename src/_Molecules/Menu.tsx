import React, { useState } from 'react'
import VerticalMenu from './VerticalMenu'
import HorizontalMenu from './HorizontalMenu'

type MenuDirection = 'Vertical' | 'Horizontal'

export type MenuItemType = 'Command' | 'Folder' | 'Group' | 'SubMenu'
export class MenuItem {
  label = ''
  type: MenuItemType = 'Command'
  selectable: boolean = true
  command?: (e: any) => void
  children?: MenuItem[]
  icon?: React.JSX.Element
  id = ''
}

export interface MenuItemState {
  collapsed: boolean
}

export class MenuState {
  menuItemStateById: { [id: string]: MenuItemState } = {}
  activeItemId = ''
}

export function activateItem(item: MenuItem, shellMenuState?: MenuState) {
  if (item.command) {
    item.command(null)
  }
}

export function getItemState(menuState: MenuState, itemId: string): MenuItemState {
  const itemState: MenuItemState | null | undefined = menuState.menuItemStateById[itemId]
  if (itemState) {
    return itemState
  }
  const newItemState = { collapsed: false }
  menuState.menuItemStateById[itemId] = newItemState
  return newItemState
}

export const Menu1: React.FC<{
  menuItems: MenuItem[]
  direction: MenuDirection
  styleType?: number
}> = ({ menuItems, direction, styleType = 0 }) => {
  const [menuState, setMenuState] = useState<MenuState>({ activeItemId: '', menuItemStateById: {} })
  switch (direction) {
    case 'Vertical':
      return (
        <VerticalMenu
          menuItems={menuItems}
          menuState={menuState}
          onMenuStateChanged={(ms) => setMenuState(ms)}
          styleType={styleType}
        ></VerticalMenu>
      )
    case 'Horizontal':
      return (
        <HorizontalMenu
          menuItems={menuItems}
          menuState={menuState}
          onMenuStateChanged={(ms) => setMenuState(ms)}
        ></HorizontalMenu>
      )
  }
  return <div>Menu</div>
}

const Menu: React.FC<{
  menuItems: MenuItem[]
  menuState: MenuState
  direction: MenuDirection
  onMenuStateChanged?: (ms: MenuState) => void
}> = ({ menuItems, menuState, direction, onMenuStateChanged }) => {
  switch (direction) {
    case 'Vertical':
      return (
        <VerticalMenu
          menuItems={menuItems}
          menuState={menuState}
          onMenuStateChanged={onMenuStateChanged || (() => {})}
        ></VerticalMenu>
      )
    case 'Horizontal':
      return (
        <HorizontalMenu
          menuItems={menuItems}
          menuState={menuState}
          onMenuStateChanged={onMenuStateChanged || (() => {})}
        ></HorizontalMenu>
      )
  }
  return <div>Menu</div>
}

export default Menu
