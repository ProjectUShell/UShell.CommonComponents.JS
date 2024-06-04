import React from 'react'
import { ObjectGraphNode } from '../ObjectGraphNode'
import { EntitySchemaService } from '../../../data/EntitySchemaService'
import { SchemaRoot } from 'fusefx-modeldescription'

const Breadcrumb: React.FC<{
  schemaRoot: SchemaRoot
  nodes: ObjectGraphNode[]
  onNodeClick: (n: ObjectGraphNode[], currentRecord: any) => void
  dirty: boolean
}> = ({ schemaRoot, nodes, onNodeClick, dirty }) => {
  function getLabel(n: ObjectGraphNode, i: number) {
    if (i >= nodes.length - 1) {
      const node: ObjectGraphNode = nodes[i]
      if (n.record && !n.parent) {
        return (
          n.dataSource.entitySchema!.name +
          ' ' +
          EntitySchemaService.getLabel(schemaRoot, node.dataSource!.entitySchema!.name, node.record)
        )
      }
      return n.dataSource.entitySchema!.name
    }
    console.log('breadcrumb nodes', n)
    const succNode: ObjectGraphNode = nodes[i + 1]

    return succNode.parent?.record
      ? n.dataSource.entitySchema!.name +
          ' ' +
          EntitySchemaService.getLabel(
            schemaRoot,
            succNode.dataSource.entitySchema!.name,
            succNode.parent.record,
          )
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
    <div className='font-bold flex p-1'>
      <div className='h-full w-full bg-breadcrumb dark:bg-bg1dark border-0 border-bg6 dark:border-bg3dark flex items-center content-center align-middle'>
        {nodes.map((n, i) => (
          <div key={i} className='flex justify-start'>
            {i > 0 && <span className='py-1 m-0'>/</span>}
            <button
              disabled={dirty}
              className={`rounded-sm p-1 m-0
              ${dirty ? '' : 'hover:bg-bg1 dark:hover:bg-bg2dark'}`}
              onClick={() => onNodeClick(nodes.slice(0, i + 1), getCallingRecord(i))}
            >
              {getLabel(n, i)}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Breadcrumb
