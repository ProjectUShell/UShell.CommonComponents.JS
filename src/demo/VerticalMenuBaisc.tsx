import React from 'react'
import Menu, { Menu1 } from '../_Molecules/Menu'

const VerticalMenuBaisc = () => {
  return (
    <div className='p-2 w-full flex justify-between overflow-auto'>
      <div className='w-80'>
        <Menu1
          direction='Vertical'
          menuItems={[
            {
              id: 'Folder',
              label: 'Folder',
              type: 'Folder',
              children: [
                {
                  id: 'DoSomethingA',
                  label: 'Do Something A',
                  type: 'Command',
                  children: [],
                  selectable: false,
                },
                {
                  id: 'DoSomethingB',
                  label: 'Do Something B',
                  type: 'Command',
                  children: [],
                  selectable: false,
                },
                {
                  id: 'DoSomethingC',
                  label: 'Do Something C',
                  type: 'Command',
                  children: [],
                  selectable: false,
                },
              ],
              selectable: false,
            },
            {
              id: 'Group',
              label: 'Groups',
              type: 'Group',
              children: [
                {
                  id: 'NavigateA',
                  label: 'Navigate A',
                  type: 'Command',
                  children: [],
                  selectable: true,
                },
                {
                  id: 'NavigateB',
                  label: 'Navigate B',
                  type: 'Command',
                  children: [],
                  selectable: true,
                },
              ],
              selectable: false,
            },
            {
              id: 'NestedFolderA',
              label: 'Nested Folder A',
              type: 'Folder',
              children: [
                {
                  id: 'ExecuteSomethingA',
                  label: 'Execute Something A',
                  type: 'Command',
                  children: [],
                  selectable: false,
                },
                {
                  id: 'ExecuteSomethingB',
                  label: 'Execute Something B',
                  type: 'Command',
                  children: [],
                  selectable: false,
                },
                {
                  id: 'NestedFolderB',
                  label: 'Nested Folder B',
                  type: 'Folder',
                  children: [
                    {
                      id: 'Execute Something A2',
                      label: 'Do Something A',
                      type: 'Command',
                      children: [],
                      selectable: false,
                    },
                    {
                      id: 'Execute Something B2',
                      label: 'Do Something B',
                      type: 'Command',
                      children: [],
                      selectable: false,
                    },
                  ],
                  selectable: false,
                },
              ],
              selectable: false,
            },
            {
              id: 'SubMenu',
              label: 'Sub Menu',
              type: 'SubMenu',
              children: [
                {
                  id: 'SubMenuItemA',
                  label: 'Sub Menu Item A',
                  type: 'Command',
                  children: [],
                  selectable: false,
                },
                {
                  id: 'SubMenuItemB',
                  label: 'Sub Menu Item B',
                  type: 'Command',
                  children: [],
                  selectable: false,
                },
              ],
              selectable: false,
            },
          ]}
        ></Menu1>
      </div>
      <div className='w-80'>
        <Menu1
          styleType={1}
          direction='Vertical'
          menuItems={[
            {
              id: 'SubMenu1',
              label: 'Sub Menu',
              type: 'SubMenu',
              children: [
                {
                  id: 'SubMenuItemA1',
                  label: 'Sub Menu Item A',
                  type: 'Command',
                  children: [],
                  selectable: false,
                },
                {
                  id: 'SubMenuItemB1',
                  label: 'Sub Menu Item B',
                  type: 'Command',
                  children: [],
                  selectable: false,
                },
              ],
              selectable: false,
            },
            {
              id: 'Folder',
              label: 'Folder',
              type: 'Folder',
              children: [
                {
                  id: 'DoSomethingA',
                  label: 'Do Something A',
                  type: 'Command',
                  children: [],
                  selectable: false,
                },
                {
                  id: 'DoSomethingB',
                  label: 'Do Something B',
                  type: 'Command',
                  children: [],
                  selectable: false,
                },
                {
                  id: 'DoSomethingC',
                  label: 'Do Something C',
                  type: 'Command',
                  children: [],
                  selectable: false,
                },
              ],
              selectable: false,
            },
            {
              id: 'Group',
              label: 'Groups',
              type: 'Group',
              children: [
                {
                  id: 'NavigateA',
                  label: 'Navigate A',
                  type: 'Command',
                  children: [],
                  selectable: true,
                },
                {
                  id: 'NavigateB',
                  label: 'Navigate B',
                  type: 'Command',
                  children: [],
                  selectable: true,
                },
              ],
              selectable: false,
            },
            {
              id: 'NestedFolderA',
              label: 'Nested Folder A',
              type: 'Folder',
              children: [
                {
                  id: 'ExecuteSomethingA',
                  label: 'Execute Something A',
                  type: 'Command',
                  children: [],
                  selectable: false,
                },
                {
                  id: 'ExecuteSomethingB',
                  label: 'Execute Something B',
                  type: 'Command',
                  children: [],
                  selectable: false,
                },
                {
                  id: 'NestedFolderB',
                  label: 'Nested Folder B',
                  type: 'Folder',
                  children: [
                    {
                      id: 'Execute Something A2',
                      label: 'Do Something A',
                      type: 'Command',
                      children: [],
                      selectable: false,
                    },
                    {
                      id: 'Execute Something B2',
                      label: 'Do Something B',
                      type: 'Command',
                      children: [],
                      selectable: false,
                    },
                  ],
                  selectable: false,
                },
              ],
              selectable: false,
            },
          ]}
        ></Menu1>
      </div>
    </div>
  )
}

export default VerticalMenuBaisc
