import { ShellMenu, MenuItem } from './ShellMenu'
import { CommandDescription, ModuleDescription } from 'ushell-portfoliodescription'

export class MenuBuilder {
  public static buildMenuFromModuleUrl(
    moduleUrl: string,
    executeCommand: (comman: CommandDescription, e: any) => void,
  ): Promise<ShellMenu> {
    return fetch(moduleUrl, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        return response.json()
      })
      .then((md: ModuleDescription) => {
        return this.buildMenuFromModule(md, executeCommand)
      })
  }

  public static buildMenuFromModule(
    module: ModuleDescription,
    executeCommand: (comman: CommandDescription, e: any) => void,
  ): ShellMenu {
    const commands: CommandDescription[] = module.commands
    const result: ShellMenu = new ShellMenu()
    commands.forEach((command: CommandDescription) => {
      this.pushIntoMenu(command, executeCommand, result)
    })
    return result
  }

  private static pushIntoMenu(
    command: CommandDescription,
    executeCommand: (comman: CommandDescription, e: any) => void,
    shellMenu: ShellMenu,
  ) {
    if (command.menuFolder == '') {
      return
    }
    //TODO_KRN what is menuOwnerUsecaseKey? => tooblar im usecase selbst
    const menuFolders: string[] = command.menuFolder ? command.menuFolder.split('\\') : []
    this.peekOrCreateItem(menuFolders, command, executeCommand, shellMenu.items)
  }

  static peekOrCreateItem(
    menuFolders: string[],
    command: CommandDescription,
    executeCommand: (comman: CommandDescription, e: any) => void,
    menuItems: MenuItem[],
  ) {
    if (!menuFolders || menuFolders.length == 0) {
      const menuItem: MenuItem = {
        id: command.uniqueCommandKey,
        label: command.label,
        type: 'Command',
        command: (e: any) => executeCommand(command, e),
      }
      menuItems.push(menuItem)
    }

    let currentFolder: MenuItem | undefined
    menuFolders.forEach((menuFolder: string) => {
      currentFolder = menuItems.find((i) => i.type == 'Folder' && i.label == menuFolder)
      if (!currentFolder) {
        currentFolder = {
          id: menuFolder,
          label: menuFolder,
          type: 'Folder',
          children: [],
        }
        menuItems.push(currentFolder)
      }
      if (!currentFolder.children) {
        currentFolder.children = []
      }
      this.peekOrCreateItem(menuFolders.slice(1), command, executeCommand, currentFolder.children)
    })
  }
}
