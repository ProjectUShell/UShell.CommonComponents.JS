import React from 'react'
import { ObjectGraphNode } from '../ObjectGraphNode'
import { EntitySchemaService } from '../../../data/EntitySchemaService'

const Breadcrumb: React.FC<{
  nodes: ObjectGraphNode[]
  onNodeClick: (n: ObjectGraphNode[], currentRecord: any) => void
  dirty: boolean
}> = ({ nodes, onNodeClick, dirty }) => {
  function getLabel(n: ObjectGraphNode, i: number) {
    if (i >= nodes.length - 1) {
      return n.dataSource.entitySchema!.name
    }
    const succNode: ObjectGraphNode = nodes[i + 1]
    return succNode.parent?.record
      ? n.dataSource.entitySchema!.name +
          ' ' +
          EntitySchemaService.getLabelByEntitySchema(succNode.dataSource.entitySchema!, succNode.parent.record)
      : n.dataSource.entitySchema!.name
  }

  function getCallingRecord(i: number): any {
    if (i >= nodes.length - 1) {
      return null
    }
    const succNode: ObjectGraphNode = nodes[i + 1]
    return succNode.parent?.record
  }

  return (
    <div className='font-bold flex'>
      {nodes.map((n, i) => (
        <div key={i} className='flex justify-start'>
          {i > 0 && <span className='py-1 m-1'>/</span>}
          <button
            disabled={dirty}
            className='rounded-md p-1 m-1
             disabled:hover:bg-backgroundthree hover:bg-backgroundone
              disabled:dark:hover:bg-backgroundthreedark dark:hover:bg-backgroundonedark'
            onClick={() => onNodeClick(nodes.slice(0, i + 1), getCallingRecord(i))}
          >
            {getLabel(n, i)}
          </button>
        </div>
      ))}
    </div>
  )
}

export default Breadcrumb
