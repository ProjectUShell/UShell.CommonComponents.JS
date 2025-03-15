import React from 'react'
import { ObjectGraphNode } from '../ObjectGraphNode'
import { EntitySchemaService } from '../../../data/EntitySchemaService'
import { SchemaRoot } from 'fusefx-modeldescription'
import ChevronDown from '../../shell-layout/_Icons/ChevronDown'
import ArrowUpIcon from '../../../_Icons/ArrowUpIcon' // Import the ArrowUpIcon
import ChevrodnDownIcon from '../../../_Icons/ChevrodnDownIcon'
import ArrowLeftStartOnRectangle from '../../../_Icons/ArrowLeftStartOnRectangle'
import ArrowUpIcon2 from '../../../_Icons/ArrowUpIcon2'

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
    const succNode: ObjectGraphNode = nodes[i + 1]

    return succNode.parent?.record
      ? n.dataSource.entitySchema!.name +
          ' ' +
          EntitySchemaService.getLabel(
            schemaRoot,
            succNode.parent.dataSource.entitySchema!.name,
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
    <div className='font-bold flex p-2'>
      <div
        style={{ borderRadius: '0.25rem' }}
        className='flex w-full border justify-start bg-navigationSelected1 dark:bg-navigationSelectedDark1 border-menuBorder dark:border-menuBorderDark'
      >
        <div className='h-full w-full1 flex justify-start items-center content-center align-middle '>
          <div className='flex justify-start py-1 pl-1 w-full gap-1 items-center'>
            <button
              disabled={dirty || nodes.length <= 1} // Disable button if dirty or no parent node
              className={`rounded-md p-1 m-0 flex justify-center items-center disabled:opacity-50
              ${
                dirty || nodes.length <= 1
                  ? ''
                  : 'hover:bg-breadcrumbHover dark:hover:bg-breadcrumbHoverDark'
              }`}
              onClick={() =>
                onNodeClick(nodes.slice(0, nodes.length - 1), getCallingRecord(nodes.length - 2))
              }
            >
              <ArrowUpIcon2 size={1.2} strokeWidth={3} rotate={0}></ArrowUpIcon2>
            </button>
          </div>
          {nodes.map((n, i) => (
            <div key={i} className='flex justify-start py-1 pl-1  w-full gap-1 items-center'>
              {i > 0 && (
                <span className='py-1 m-0'>
                  <ChevrodnDownIcon size={0.8} strokeWidth={4} rotate={270}></ChevrodnDownIcon>
                </span>
              )}
              <button
                disabled={dirty}
                className={`rounded-md p-1 m-0
              ${dirty ? '' : 'hover:bg-breadcrumbHover dark:hover:bg-breadcrumbHoverDark'}`}
                onClick={() => onNodeClick(nodes.slice(0, i + 1), getCallingRecord(i))}
              >
                {getLabel(n, i)}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Breadcrumb
