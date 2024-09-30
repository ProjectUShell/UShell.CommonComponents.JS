import React from 'react'
import Accordion from './Accordion'
import { onlyUnique } from '../utils/ArrayUtils'
import VerticalMenu from '../components/shell-layout/_Organisms/VerticalMenu'

const AccordionMenu: React.FC<{
  groups: {
    [name: string]: {
      label?: string | JSX.Element
      items: {
        label: string | JSX.Element
        command: () => void
      }[]
    }
  }
}> = ({ groups }) => {
  return (
    <Accordion
      items={Object.keys(groups).map((g) => {
        return {
          label: groups[g].label || g,
          content: (
            <div className='flex flex-col py-1'>
              {groups[g].items.map((item, i) => (
                <div
                  className='hover:bg-contentHover dark:hover:bg-contentHoverDark cursor-pointer'
                  key={i}
                  onClick={() => item.command()}
                >
                  <button className='p-2 '>{item.label}</button>
                </div>
              ))}
            </div>
          ),
        }
      })}
    ></Accordion>
  )
}

export default AccordionMenu
