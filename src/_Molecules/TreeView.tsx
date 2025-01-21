import React, { useMemo, useState } from 'react'
import ChevrodnDownIcon from '../_Icons/ChevrodnDownIcon'
import { keyframes } from 'styled-components'

class TreeNode {
  id: any
  children: TreeNode[] = []
  name: string = ''
  type: 'folder' | 'file' = 'file'
  render: (column: string) => JSX.Element = () => <div>{this.name}</div>
  onSelected?: () => void = () => {}
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
      type: 'file',
      onSelected: () => {},
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
      type: remainingPath.length > 0 ? 'folder' : 'file',
      onSelected: () => {},
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
  return <TreeView nodes={nodes}></TreeView>
}

const TreeView: React.FC<{
  nodes: TreeNode[]
  onNodeSelected?: (n: TreeNode) => void
}> = ({ nodes, onNodeSelected }) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  return (
    <TreeViewInner
      depth={0}
      nodes={nodes}
      selectedNode={selectedNode}
      setSelectedNode={setSelectedNode}
      onTreeNodeSelected={onNodeSelected}
    ></TreeViewInner>
  )
}

const TreeViewInner: React.FC<{
  nodes: TreeNode[]
  depth: number
  selectedNode: any | null
  setSelectedNode: (n: any | null) => void
  onTreeNodeSelected?: (n: TreeNode) => void
}> = ({ nodes, depth, selectedNode, setSelectedNode, onTreeNodeSelected }) => {
  const [close, setClose] = useState<{ [n: string]: Boolean }>({})

  function onNodeSelected(n: TreeNode, shouldToggle: boolean) {
    setSelectedNode(n.id)
    if (n.onSelected) {
      n.onSelected()
    } else {
      if (onTreeNodeSelected) {
        onTreeNodeSelected(n)
      }
    }

    if (!shouldToggle) return
    const newClose = { ...close }
    newClose[n.id] = !newClose[n.id]
    setClose(newClose)
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
            className={`border-b-0 border-navigationBorder dark:border-navigationBorderDark   `}
            onClick={(e) => {
              e.stopPropagation()
              onNodeSelected(n, n.type == 'folder')
            }}
          >
            <div
              className={`flex gap-2 p-2.5 ${
                selectedNode == n.id
                  ? 'bg-prim2 dark:bg-prim2Dark'
                  : 'hover:bg-navigationHover dark:hover:bg-navigationHoverDark'
              }`}
              style={{ marginLeft: depth * 30 }}
            >
              {n.children && n.children.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onNodeSelected(n, true)
                  }}
                >
                  <ChevrodnDownIcon
                    size={0.8}
                    strokeWidth={5}
                    rotate={close[n.id] ? 270 : 360}
                  ></ChevrodnDownIcon>
                </button>
              )}
              <div className={`select-none ${n.children.length > 0 ? 'font-bold' : 'pl-6'} `}>
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
                onTreeNodeSelected={onTreeNodeSelected}
              ></TreeViewInner>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default TreeView
