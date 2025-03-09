import React from 'react'
import { MenuItem, ShellMenu } from '../ShellMenu'
import VerticalMenu from './VerticalMenu'
import HorizontalMenu from './HorizontalMenu'
import { ShellMenuState } from '../ShellMenuState'

type MenuDirection = 'Vertical' | 'Horizontal'

const Menu: React.FC<{
  menuItems: MenuItem[]
  shellMenu: ShellMenu
  shellMenuState: ShellMenuState
  direction: MenuDirection
  filter?: string
}> = ({ menuItems, shellMenu, shellMenuState, direction, filter }) => {
  switch (direction) {
    case 'Vertical':
      return (
        <VerticalMenu
          shellMenu={shellMenu}
          menuItems={menuItems}
          shellMenuState={shellMenuState}
          filter={filter}
        ></VerticalMenu>
      )
    case 'Horizontal':
      return (
        <HorizontalMenu
          menuItems={menuItems}
          shellMenu={shellMenu}
          shellMenuState={shellMenuState}
        ></HorizontalMenu>
      )
  }
  return <div>Menu</div>
}

export default Menu
