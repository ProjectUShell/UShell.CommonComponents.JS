import React, { useMemo, useState } from 'react'
import ChevrodnDownIcon from '../_Icons/ChevrodnDownIcon'
import { keyframes } from 'styled-components'

class TreeNode {
  id: any
  children: TreeNode[] = []
  name: string = ''
  render: (column: string) => JSX.Element = () => <div>{this.name}</div>
}

function pushIntoNodes(
  nodes: TreeNode[],
  path: string[],
  d: any,
  keyField: string,
  currentPath: string,
  renderColumn?: (d: any, c: string) => JSX.Element,
) {
  if (path.length == 0) {
    nodes.push({
      id: d[keyField],
      name: d[keyField],
      children: [],
      render: renderColumn
        ? (c: string) => renderColumn(d, c)
        : (c: string) => <div>{d[keyField]}</div>,
    })
    return
  }
  const currentPathEntry = path[0]
  const remainingPath: string[] = path.slice(1)
  let existingNode: TreeNode | undefined = nodes.find((n) => n.name == currentPathEntry)
  currentPath = currentPath += '/' + currentPathEntry
  if (!existingNode) {
    existingNode = {
      name: currentPathEntry,
      children: [],
      id: currentPath,
      render: (c: string) => <div>{currentPathEntry}</div>,
    }
    nodes.push(existingNode)
  }
  pushIntoNodes(existingNode.children, remainingPath, d, keyField, currentPath, renderColumn)
}

export const TreeView1: React.FC<{
  data: any[]
  pathField: string
  keyField: string
  renderColumn?: (d: any, c: string) => JSX.Element
}> = ({ data, pathField, keyField, renderColumn }) => {
  const nodes = useMemo(() => {
    const result: TreeNode[] = []
    data.forEach((d) => {
      const path: string[] = d[pathField].split('/')
      pushIntoNodes(result, path, d, keyField, '', renderColumn)
    })
    return result
  }, [data])
  return <TreeView nodes={nodes} keyField={keyField}></TreeView>
}

const TreeView: React.FC<{ nodes: TreeNode[]; keyField: string }> = ({ nodes, keyField }) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  return (
    <TreeViewInner
      depth={0}
      nodes={nodes}
      selectedNode={selectedNode}
      setSelectedNode={setSelectedNode}
    ></TreeViewInner>
  )
}

const TreeViewInner: React.FC<{
  nodes: TreeNode[]
  depth: number
  selectedNode: any | null
  setSelectedNode: (n: any | null) => void
}> = ({ nodes, depth, selectedNode, setSelectedNode }) => {
  const [close, setClose] = useState<{ [n: string]: Boolean }>({})

  function toggleClose(n: any) {
    const newClose = { ...close }
    newClose[n] = !newClose[n]
    setClose(newClose)
    setSelectedNode(n)
  }
  return (
    <div
      className='text-sm border-0 h-full'
      onClick={(e) => {
        setSelectedNode(null)
      }}
    >
      {nodes.map((n: TreeNode, i) => (
        <div key={i} className='flex flex-col '>
          <div
            className={`border-b border-navigationBorder dark:border-navigationBorderDark   ${
              selectedNode == n.id
                ? 'bg-prim2 dark:bg-prim6'
                : 'hover:bg-navigationHover dark:hover:bg-navigationHoverDark'
            }`}
            onClick={(e) => {
              e.stopPropagation()
              toggleClose(n.id)
            }}
          >
            <div className='flex gap-1 p-3' style={{ marginLeft: depth * 30 }}>
              {n.children && n.children.length > 0 && (
                <button>
                  <ChevrodnDownIcon size={3} rotate={close[n.id] ? 270 : 360}></ChevrodnDownIcon>
                </button>
              )}
              <div className={`select-none ${n.children.length > 0 ? 'font-bold' : ''} `}>
                {n.render('')}
              </div>
            </div>
          </div>
          {!close[n.id] && n.children.length > 0 && (
            <div className=''>
              <TreeViewInner
                nodes={n.children}
                depth={depth + 1}
                selectedNode={selectedNode}
                setSelectedNode={setSelectedNode}
              ></TreeViewInner>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default TreeView
