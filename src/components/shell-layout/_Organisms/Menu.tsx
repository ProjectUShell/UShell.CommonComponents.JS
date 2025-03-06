import React from 'react'
import { MenuItem } from '../ShellMenu'
import VerticalMenu from './VerticalMenu'
import HorizontalMenu from './HorizontalMenu'
import { ShellMenuState } from '../ShellMenuState'

type MenuDirection = 'Vertical' | 'Horizontal'

const Menu: React.FC<{
  menuItems: MenuItem[]
  shellMenuState: ShellMenuState
  direction: MenuDirection
  filter?: string
}> = ({ menuItems, shellMenuState, direction, filter }) => {
  switch (direction) {
    case 'Vertical':
      return (
        <VerticalMenu
          menuItems={menuItems}
          shellMenuState={shellMenuState}
          filter={filter}
        ></VerticalMenu>
      )
    case 'Horizontal':
      return <HorizontalMenu menuItems={menuItems} shellMenuState={shellMenuState}></HorizontalMenu>
  }
  return <div>Menu</div>
}

export default Menu
