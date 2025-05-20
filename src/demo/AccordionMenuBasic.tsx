import React, { useState } from 'react'
import AccordionMenu from '../_Molecules/AccordionMenu'
import PencilIcon from '../_Icons/PencilIcon'
import { createServiceProxy } from '../data/ServiceFactory'

const AccordionMenuBasic = () => {
  const [selectedItem, setSelecteItem] = useState('Item1.1')
  return (
    <div className='flex flex-col gap-1'>
      <button
        className='p-1 hover:bg-menuHover dark:hover:bg-menuHoverDark'
        onClick={() => {
          const service = createServiceProxy<{ getData: (id: number) => Promise<string> }>(
            'https://api.example.com/service',
          )
          service.getData(1).then((data) => console.log(data))
          setSelecteItem('Item2.1')
        }}
      >
        Force 2.1
      </button>
      <AccordionMenu
        initialSelectedItemKey={selectedItem}
        onGroupChanged={(groupName: string) => console.log('Group changed', groupName)}
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
                key: 'Item1.1',
                label: 'Item 1.1',
                command: () => {
                  console.log('Item 1.1')
                },
              },
              {
                key: 'Item1.2',
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
                key: 'Item2.1',
                label: 'Item 2.1',
                command: () => {
                  console.log('Item 2.1')
                },
              },
              {
                key: 'Item2.2',
                label: 'Item 2.2',
                command: () => {
                  console.log('Item 2.2')
                },
              },
            ],
          },
        }}
      ></AccordionMenu>
    </div>
  )
}

export default AccordionMenuBasic
