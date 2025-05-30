import React, { useEffect, useMemo, useState } from 'react'
import TopBar, { TopBarTab } from '../_Organisms/TopBar'
import VerticalShellLayout from './VerticalShellLayout'
import HorizontalShellLayout from './HorizontalShellLayout'
import {
  ColorMode,
  LayoutMode,
  loadShellSettings,
  saveShellSettings,
  ShellSettings,
} from '../ShellSettings'
import { findMenuItem, getCommandItems, MenuItem, ShellMenu } from '../ShellMenu'
import {
  activateItem,
  loadActiveShellMenuState,
  loadShellMenuStates,
  setActiveShellMenuState,
  ShellMenuState,
} from '../ShellMenuState'

// import '../../../tailwind.css'

const ShellLayout: React.FC<{
  shellMenu: ShellMenu
  children: any
  title: JSX.Element | string
  showBreadcrumb?: boolean
  showSearchBar?: boolean
}> = ({ shellMenu, children, title, showBreadcrumb, showSearchBar }) => {
  const [shellSettings, setShellSettings] = useState<ShellSettings>({
    colorMode: ColorMode.Light,
    layoutMode: LayoutMode.Vertical,
  })
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeMenuItemsKey, setActiveMenuItemsKey] = useState(loadActiveShellMenuState())

  useEffect(() => {
    setShellSettings(loadShellSettings())
  }, [])

  useEffect(() => {
    const shellMenuState: ShellMenuState = getActiveShellMenuState()
    const menuItems: MenuItem[] = getActiveShellMenuItems()
    const activeItem: MenuItem | undefined = findMenuItem(menuItems, shellMenuState.activeItemId)

    if (activeItem) {
      activateItem(activeItem, shellMenu, shellMenuState)
    } else {
      if (menuItems.length > 0) {
        const commandItems = getCommandItems(menuItems)
        if (commandItems.length > 0) {
          setActiveShellMenuState(commandItems[0].id)
          activateItem(commandItems[0], shellMenu, shellMenuState)
        }
      }
    }
  }, [activeMenuItemsKey])

  const toggleSidebarOpen = () => {
    setSidebarOpen((o) => !o)
  }

  function setLayoutMode(layoutMode: LayoutMode) {
    setShellSettings((ss) => {
      const newSettings: ShellSettings = { ...ss, layoutMode: layoutMode }
      saveShellSettings(newSettings)
      return newSettings
    })
  }

  function setColorMode(colorMode: ColorMode) {
    setShellSettings((ss) => {
      const newSettings: ShellSettings = { ...ss, colorMode: colorMode }
      saveShellSettings(newSettings)
      return newSettings
    })
  }

  function getActiveShellMenuItems(): MenuItem[] {
    const result: MenuItem[] | undefined = shellMenu.subItems?.get(activeMenuItemsKey)
    return result ? result : shellMenu.items
  }

  function getActiveShellMenuState(): ShellMenuState {
    const result: ShellMenuState | undefined = loadShellMenuStates().find(
      (ms) => ms.id.toLocaleLowerCase() == activeMenuItemsKey.toLocaleLowerCase(),
    )
    if (result) return result
    const newResult: ShellMenuState = new ShellMenuState()
    newResult.id = activeMenuItemsKey
    return newResult
  }
  const topBarTabs: TopBarTab[] = useMemo(() => {
    const result: TopBarTab[] = []
    if (shellMenu.subItems) {
      Array.from(shellMenu.subItems.keys()).forEach((k) => {
        result.push({
          label: k,
          action: () => {
            if (!shellMenu.subItems) return
            setActiveMenuItemsKey(k)
            setActiveShellMenuState(k)
          },
        })
      })
    }
    return result
  }, [shellMenu, activeMenuItemsKey])

  return (
    <div className={`${shellSettings.colorMode == ColorMode.Dark && 'dark'}`}>
      <div
        className={`h-screen w-screen flex flex-col overflow-hidden font-custom antialiased 
          text-textone dark:text-textonedark ${
            shellSettings.colorMode == ColorMode.Dark ? 'dark' : ''
          }`}
      >
        <TopBar
          layoutMode={shellSettings.layoutMode}
          setLayoutMode={setLayoutMode}
          setColorMode={setColorMode}
          shellSettings={shellSettings}
          toggleSidebarOpen={toggleSidebarOpen}
          topBarElements={shellMenu.topBarItems}
          tabItems={topBarTabs}
          title={title}
          initialActiveTabIndex={topBarTabs.findIndex((t) => t.label == activeMenuItemsKey)}
        ></TopBar>
        {shellSettings.layoutMode == LayoutMode.Vertical ? (
          <VerticalShellLayout
            sidebarOpen={sidebarOpen}
            shellMenu={shellMenu}
            menuItems={getActiveShellMenuItems()}
            shellMenuState={getActiveShellMenuState()}
            showBreadcrumb={showBreadcrumb}
            showSearchBar={showSearchBar}
          >
            {children}
          </VerticalShellLayout>
        ) : (
          <HorizontalShellLayout
            shellMenu={shellMenu}
            menuItems={getActiveShellMenuItems()}
            shellMenuState={getActiveShellMenuState()}
          >
            {children}
          </HorizontalShellLayout>
        )}
      </div>
    </div>
  )
}

export default ShellLayout
