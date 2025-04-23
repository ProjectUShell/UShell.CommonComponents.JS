import { findMenuItem, MenuItem, ShellMenu } from './ShellMenu'

export interface MenuItemState {
  collapsed: boolean
}

export class ShellMenuState {
  id: string = ''
  menuItemStateById: { [id: string]: MenuItemState } = {}
  activeItemId = ''
}

export function loadShellMenuStates(): ShellMenuState[] {
  const shellMenuStatesJson: string | null = localStorage.getItem('ShellMenuStates')
  if (!shellMenuStatesJson) {
    return []
  }
  return JSON.parse(shellMenuStatesJson)
}

export function loadActiveShellMenuState(): string {
  const resJson: string | null = localStorage.getItem('ActiveShellMenuState')
  if (!resJson) {
    return ''
  }
  return resJson
}

export function setActiveShellMenuState(id: string) {
  localStorage.setItem('ActiveShellMenuState', id)
}

export function saveShellMenuState(shellMenuState: ShellMenuState, active: boolean) {
  const shellMenuStates: ShellMenuState[] = loadShellMenuStates()
  const existingIndex = shellMenuStates.findIndex(
    (ms) => ms.id.toLocaleLowerCase() === shellMenuState.id.toLocaleLowerCase(),
  )
  if (existingIndex >= 0) {
    shellMenuStates[existingIndex] = shellMenuState
  } else {
    shellMenuStates.push(shellMenuState)
  }
  localStorage.setItem('ShellMenuStates', JSON.stringify(shellMenuStates))
  if (active) {
    localStorage.setItem('ActiveShellMenuState', shellMenuState.id)
  }
}

export function getItemState(shellMenuState: ShellMenuState, itemId: string): MenuItemState {
  const itemState: MenuItemState | null | undefined = shellMenuState.menuItemStateById[itemId]
  if (itemState) {
    return itemState
  }
  const newItemState = { collapsed: false }
  shellMenuState.menuItemStateById[itemId] = newItemState
  return newItemState
}

export async function toggleFolderCollapse(
  shellMenuState: ShellMenuState,
  itemId: string,
): Promise<ShellMenuState> {
  const itemState: MenuItemState = getItemState(shellMenuState, itemId)
  itemState.collapsed = !itemState.collapsed
  saveShellMenuState(shellMenuState, false)
  return shellMenuState
}

export function findShellMenuStateId(menu: ShellMenu, item: MenuItem): string {
  if (menu.items.includes(item)) {
    return ''
  }
  if (!menu.subItems) {
    return ''
  }
  const subMenuItemsKeys: string[] = Array.from(menu.subItems.keys())
  for (let key of subMenuItemsKeys) {
    if (findMenuItem(menu.subItems.get(key) || [], item.id)) {
      return key
    }
  }
  return 'asd'
}

export function activateItem(item: MenuItem, menu: ShellMenu, shellMenuState?: ShellMenuState) {
  const shellMenuStateId: string = shellMenuState
    ? shellMenuState.id
    : findShellMenuStateId(menu, item)
  if (!shellMenuState) {
    shellMenuState = loadShellMenuStates().find(
      (ms) => ms.id.toLocaleLowerCase() === shellMenuStateId.toLocaleLowerCase(),
    )
  }
  if (!shellMenuState) {
    shellMenuState = new ShellMenuState()
    shellMenuState.id = shellMenuStateId
  }
  shellMenuState.activeItemId = item.id
  if (item.command) {
    item.command(null)
  }
  saveShellMenuState(shellMenuState, true)
}
