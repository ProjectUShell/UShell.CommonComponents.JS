import { ReactElement } from 'react'

export type MenuItemType = 'Command' | 'Group' | 'Folder'

export class MenuItem {
  label = ''
  type: MenuItemType = 'Command'
  command?: (e: any) => void
  children?: MenuItem[]
  icon?: ReactElement
  id = ''
}

export interface TopBarItem {
  icon: ReactElement
  command?: (e: any) => void
  id: string
}

export class ShellMenu {
  items: MenuItem[] = []
  topBarItems?: TopBarItem[] = []
}
