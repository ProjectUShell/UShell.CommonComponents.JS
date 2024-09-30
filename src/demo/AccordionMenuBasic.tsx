import React from 'react'
import AccordionMenu from '../_Molecules/AccordionMenu'
import PencilIcon from '../_Icons/PencilIcon'

const AccordionMenuBasic = () => {
  return (
    <AccordionMenu
      groups={{
        'Group 1': {
          label: (
            <div className='flex gap-2 items-center'>
              <PencilIcon></PencilIcon>
              Group 1
            </div>
          ),
          items: [
            {
              label: 'Item 1.1',
              command: () => {
                console.log('Item 1.1')
              },
            },
            {
              label: 'Item 1.2',
              command: () => {
                console.log('Item 1.2')
              },
            },
          ],
        },
        'Group 2': {
          items: [
            {
              label: 'Item 2.1',
              command: () => {
                console.log('Item 2.1')
              },
            },
            {
              label: 'Item 2.2',
              command: () => {
                console.log('Item 2.2')
              },
            },
          ],
        },
      }}
    ></AccordionMenu>
  )
}

export default AccordionMenuBasic
