import React from 'react'
import TreeView from '../_Molecules/TreeView'

const TreeViewBasic = () => {
  return (
    <TreeView
      onNodeSelected={(n) => console.log('node selected', n)}
      nodes={[
        {
          id: 1,
          name: 'test',
          type: 'file',
          render: () => <div>World</div>,
          children: [
            { id: 2, name: 'test', type: 'file', children: [], render: () => <div>Australia</div> },
            {
              id: 3,
              name: 'test',
              type: 'file',
              render: () => <div>Europe</div>,
              children: [
                {
                  id: 4,
                  name: 'test',
                  type: 'file',
                  children: [],
                  render: () => <div>France</div>,
                },
                { id: 5, name: 'test', type: 'file', children: [], render: () => <div>Italy</div> },
              ],
            },
          ],
        },
      ]}
    ></TreeView>
  )
}

export default TreeViewBasic
