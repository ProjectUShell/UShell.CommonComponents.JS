import { MenuItem } from './ShellMenu'

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

export function activateItem(item: MenuItem, shellMenuState?: ShellMenuState) {
  if (!shellMenuState) {
    shellMenuState = loadShellMenuStates().find(
      (ms) => ms.id.toLocaleLowerCase() === item.id.toLocaleLowerCase(),
    )
  }
  if (!shellMenuState) {
    shellMenuState = new ShellMenuState()
    shellMenuState.id = item.id
  }
  shellMenuState.activeItemId = item.id
  if (item.command) {
    item.command(null)
  }
  saveShellMenuState(shellMenuState, true)
}
