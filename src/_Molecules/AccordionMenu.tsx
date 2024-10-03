import React, { useState } from 'react'
import Accordion from './Accordion'
import { onlyUnique } from '../utils/ArrayUtils'
import VerticalMenu from '../components/shell-layout/_Organisms/VerticalMenu'

const AccordionMenu: React.FC<{
  groups: {
    [name: string]: {
      label?: string | JSX.Element
      items: {
        key: string
        label: string | JSX.Element
        command: () => void
      }[]
    }
  }
  classNameBgHeader?: string
  classNameBgHeaderActive?: string
  classNameBgItems?: string
  classNameBgItemHover?: string
  classNameBgItemSelected?: string
}> = ({
  groups,
  classNameBgHeader = 'hover:bg-bg8 dark:hover:bg-bg8dark',
  classNameBgHeaderActive = 'bg-bg8 dark:bg-bg8dark',
  classNameBgItems = 'bg-content dark:bg-contentDark',
  classNameBgItemHover = 'hover:bg-contentHover dark:hover:bg-contentHoverDark',
  classNameBgItemSelected = 'bg-contentHover dark:bg-contentHoverDark',
}) => {
  const [selectedItemKey, setSelectedItemKey] = useState('')

  function isSelected(item: { key: string }) {
    return item.key == selectedItemKey
  }

  function onItemClick(item: { key: string; command: () => void }) {
    setSelectedItemKey(item.key)
    item.command()
  }

  return (
    <Accordion
      items={Object.keys(groups).map((g) => {
        return {
          label: groups[g].label || g,
          content: (
            <div className='flex flex-col py-1'>
              {groups[g].items.map((item, i) => (
                <div
                  className={`${!isSelected(item) ? classNameBgItemHover : ''} ${
                    isSelected(item) ? classNameBgItemSelected : ''
                  } cursor-pointer`}
                  key={i}
                  onClick={() => onItemClick(item)}
                >
                  <button className='p-2 '>{item.label}</button>
                </div>
              ))}
            </div>
          ),
        }
      })}
      classNameBgHeader={classNameBgHeader}
      classNameBgHeaderActive={classNameBgHeaderActive}
      classNameBgItems={classNameBgItems}
      classNameBgItemHover={classNameBgItemHover}
      classNameBgItemSelected={classNameBgItemSelected}
    ></Accordion>
  )
}

export default AccordionMenu
