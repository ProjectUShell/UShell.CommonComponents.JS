import React from 'react'
import { ObjectGraphNode } from '../ObjectGraphNode'

const Breadcrumb: React.FC<{
  nodes: ObjectGraphNode[]
  onNodeClick: (n: ObjectGraphNode[]) => void
  dirty: boolean
}> = ({ nodes, onNodeClick, dirty }) => {
  function getLabel(n: ObjectGraphNode, i: number) {
    if (i >= nodes.length - 1) {
      return n.dataSource.entitySchema!.namePlural
    }
    const succNode: ObjectGraphNode = nodes[i + 1]
    return succNode.parent?.record
      ? n.dataSource.entitySchema!.name + ' ' + succNode.parent.record['id']
      : n.dataSource.entitySchema!.namePlural
  }

  return (
    <div className='font-bold flex'>
      {nodes.map((n, i) => (
        <div key={i} className='flex justify-start'>
          {i > 0 && <span className='py-1 m-1'>/</span>}
          <button
            disabled={dirty}
            className='rounded-md py-1 m-1 enabled:hover:bg-backgroundone enabled:dark:hover:bg-backgroundonedark'
            onClick={() => onNodeClick(nodes.slice(0, i + 1))}
          >
            {getLabel(n, i)}
          </button>
        </div>
      ))}
    </div>
  )
}

export default Breadcrumb
