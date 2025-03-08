import React, { useMemo } from 'react'
import XMarkIcon from '../../../_Icons/XMarkIcon'
import { findMenuItem, findParentItem, MenuItem } from '../ShellMenu'
import { ShellMenuState } from '../ShellMenuState'
import ArrowUpIcon from '../../../_Icons/ArrowUpIcon'
import ChevrodnDownIcon from '../../../_Icons/ChevrodnDownIcon'

interface MenuSearchBarProps {
  filter: string
  setFilter: React.Dispatch<React.SetStateAction<string>>
}

class AppBreadcrumbItem {
  label = ''
  id = ''
  onClick: (e: any) => void = () => {}
}

function buildBreadcrumbItems(
  menuItems: MenuItem[],
  shellMenuState: ShellMenuState,
): AppBreadcrumbItem[] {
  const result: AppBreadcrumbItem[] = []
  let currentItem: MenuItem | undefined = findMenuItem(menuItems, shellMenuState.activeItemId)
  while (currentItem) {
    const newAppBreadcrumbItem = new AppBreadcrumbItem()
    newAppBreadcrumbItem.label = currentItem.label
    newAppBreadcrumbItem.id = currentItem.id
    newAppBreadcrumbItem.onClick = () => {
      // shellMenuState.activateItem(currentItem)
    }
    result.unshift(newAppBreadcrumbItem)
    currentItem = findParentItem(menuItems, currentItem.id)
  }
  result.unshift({ id: 'root', label: shellMenuState.id || 'Home', onClick: () => {} })
  return result
}

const AppBreadcrumb: React.FC<{ shellMenuState: ShellMenuState; menuItems: MenuItem[] }> = ({
  shellMenuState,
  menuItems,
}) => {
  const breadcrumbItems: AppBreadcrumbItem[] = useMemo(
    () => buildBreadcrumbItems(menuItems, shellMenuState),
    [menuItems, shellMenuState],
  )

  return (
    <div
      className='bg-content dark:bg-contentDark p-0 
        px-4 text-sm w-full flex justify-start items-center content-center 
        border-b border-menuBorder dark:border-menuBorderDark'
    >
      {breadcrumbItems.map((bi, i) => (
        <div key={bi.id + '0'} className='pr-1 py-1 flex items-center text-sm'>
          <div className='hover1:bg-contentHover dark:hover1:bg-contentHoverDark hover:cursor-pointer p-1'>
            {bi.label}
          </div>
          {i < breadcrumbItems.length - 1 && (
            <div key={bi.id + '1'} className='ml-1'>
              <ChevrodnDownIcon size={0.8} rotate={270} strokeWidth={4}></ChevrodnDownIcon>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default AppBreadcrumb
