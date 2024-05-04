import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { NodeData } from '../NodeData'
import { EntitySchema, FieldSchema } from 'fusefx-modeldescription'
import EditorNode from './EditorNode'
import { EdgeData } from '../EdgeData'
import EditorEdge from './EditorEdge'
import { Camera } from '../Camera'
import BoardContextMenu from './BoardContextMenu'
import {
  getBoardPosFromWindowPos,
  getViewPosFromWorldPos,
  getWorldPosFromViewPos,
} from '../BoardUtils'
import { Position } from '../Position'

const SchemaEditor: React.FC = () => {
  const boardElement = document.getElementById('board')

  const [currentId, setCurrentId] = useState(1)
  const [grabbingBoard, setGrabbingBoard] = useState(false)
  const [camera, setCamera] = useState(new Camera())
  const [clickedPosition, setClickedPosition] = useState<any>({ x: -1, y: -1 })
  const [nodes, setNodes] = useState<NodeData[]>([])
  const [edges, setEdges] = useState<EdgeData[]>([])
  const [selectedNode, setSelectedNode] = useState<number | null>(null)

  const [newEdge, setNewEdge] = useState<EdgeData | null>(null)
  const [inInput, setInInput] = useState<{
    nodeId: number
    inputIndex: number
    posX: number
    posY: number
  } | null>(null)

  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const pd = (e: any) => e.preventDefault()
    document.addEventListener('contextmenu', pd)

    const boardStateString: string | null = localStorage.getItem('boardState')
    if (boardStateString) {
      const boardState: any = JSON.parse(boardStateString)
      setNodes(boardState.nodes)
      setEdges(boardState.edges)
      let maxId: number = 0
      boardState.nodes.forEach((n: NodeData) => {
        if (n.id > maxId) {
          maxId = n.id
        }
      })
      setCurrentId(maxId + 1)
    }
    return () => {
      document.removeEventListener('contextmenu', pd)
    }
  }, [])

  function save() {
    const boardState: any = {
      nodes: nodes,
      edges: edges,
    }
    localStorage.setItem('boardState', JSON.stringify(boardState))
  }

  function createNewEntity(pos: Position): void {
    setContextMenuPos(null)
    const worldPos = getWorldPosFromViewPos(pos, camera)
    console.log('new Entity')
    const entitySchema = new EntitySchema()
    entitySchema.name = 'Entity ' + currentId
    const result: NodeData = {
      id: currentId,
      numInputs: 2,
      numOutputs: 2,
      currentPosition: { x: worldPos.x, y: worldPos.y },
      previousPosition: { x: worldPos.x, y: worldPos.y },
      inputEdgeIds: [],
      outputEdgeIds: [],
      entitySchema: entitySchema,
    }
    setCurrentId((i) => i + 1)
    setNodes([...nodes, result])
  }

  function handleCommitField(f: FieldSchema | null, value: any) {
    console.log('commit field', value)
  }

  function handleCommitEntityName(nodeData: NodeData, entityName: string) {
    nodeData.entitySchema.name = entityName
    save()
    console.log('commit entity name', nodes)
  }

  function applyScale(e: any) {
    if (!boardElement) return
    const currentScale = camera.scale
    let newScale = currentScale + e.deltaY * -0.0005
    if (newScale > 3) newScale = 3
    if (newScale < 0.5) newScale = 0.5

    const mouseWindowPos = { x: e.clientX, y: e.clientY }
    const mouseBoardPos = getBoardPosFromWindowPos(mouseWindowPos)

    const cam2X = mouseBoardPos.x / camera.scale + camera.pos.x - mouseBoardPos.x / newScale
    const cam2Y = mouseBoardPos.y / camera.scale + camera.pos.y - mouseBoardPos.y / newScale

    setCamera({ ...camera, scale: newScale, pos: { x: cam2X, y: cam2Y } })
  }

  function handleMouseDown(e: any) {
    setSelectedNode(null)
    // e.preventDefault()
    e.stopPropagation()

    if (e.button == 0) {
      setClickedPosition({ x: e.clientX, y: e.clientY })
      setContextMenuPos(null)
      setGrabbingBoard(true)
    }
    if (e.button == 2) {
      setContextMenuPos(getBoardPosFromWindowPos({ x: e.clientX, y: e.clientY }))
    }
  }

  function handleMouseUp(e: any) {
    e.preventDefault()
    setGrabbingBoard(false)
    setClickedPosition({ x: -1, y: -1 })

    if (newEdge && inInput === null) {
      setNewEdge(null)
    }
    if (newEdge && inInput !== null) {
      const nodeStartId = newEdge.nodeStartId
      const nodeEndId = inInput.nodeId

      const nodeStart = nodes.find((n) => n.id === nodeStartId)
      const nodeEnd = nodes.find((n) => n.id === nodeEndId)

      const boardWrapperEl = document.getElementById('boardWrapper')

      if (nodeStart && nodeEnd && boardWrapperEl) {
        const edgeId: string = `edge_${nodeStart.id}_${newEdge.outputIndex}_${nodeEnd.id}_${inInput.inputIndex}`
        nodeStart.outputEdgeIds = [...nodeStart.outputEdgeIds, edgeId]
        nodeEnd.inputEdgeIds = [...nodeEnd.inputEdgeIds, edgeId]
        console.log('nodeEnd.inputEdgeIds', nodeEnd.inputEdgeIds)

        newEdge.previousStartPosition = {
          x: newEdge.currentStartPosition.x,
          y: newEdge.currentStartPosition.y,
        }
        newEdge.previousEndPosition = {
          x: inInput.posX,
          y: inInput.posY,
        }
        newEdge.currentEndPosition = {
          x: inInput.posX,
          y: inInput.posY,
        }
        setEdges([
          ...edges,
          {
            ...newEdge,
            id: edgeId,
            nodeEndId: nodeEnd.id,
            inputIndex: inInput.inputIndex,
          },
        ])
        setNewEdge(null)
      }
    }
  }

  function handleMouseMove(e: any) {
    if (newEdge) {
      const windowPos: Position = { x: e.clientX, y: e.clientY }
      const boardPos: Position = getBoardPosFromWindowPos(windowPos)
      const worldPos: Position = getWorldPosFromViewPos(boardPos, camera)
      newEdge.currentEndPosition = { x: worldPos.x, y: worldPos.y }
      setNewEdge({ ...newEdge })
    }

    if (!(clickedPosition.x >= 0 && clickedPosition.y >= 0)) return
    const deltaX = e.clientX - clickedPosition.x
    const deltaY = e.clientY - clickedPosition.y
    if (selectedNode) {
      const node: NodeData | undefined = nodes.find((n) => n.id === selectedNode)
      if (node) {
        // Update node position
        node.currentPosition = {
          x: node.previousPosition.x + deltaX,
          y: node.previousPosition.y + deltaY,
        }
        setNodes([...nodes])

        // update edge positions
        for (let i = 0; i < node.inputEdgeIds.length; i++) {
          const edgeId = node.inputEdgeIds[i]
          const edge = edges.find((edge) => edge.id === edgeId)
          if (!edge) continue
          edge.currentEndPosition = {
            x: edge.previousEndPosition.x + deltaX,
            y: edge.previousEndPosition.y + deltaY,
          }
        }

        for (let i = 0; i < node.outputEdgeIds.length; i++) {
          const edgeId = node.outputEdgeIds[i]
          const edge = edges.find((edge) => edge.id === edgeId)
          if (!edge) continue
          edge.currentStartPosition = {
            x: edge.previousStartPosition.x + deltaX,
            y: edge.previousStartPosition.y + deltaY,
          }
        }
      }
    } else {
      const boardWrapperElement = document.getElementById('boardWrapper')
      if (!boardWrapperElement) return
      // boardWrapperElement.scrollBy(-deltaX, -deltaY)
      setClickedPosition({ x: e.clientX, y: e.clientY })
      camera.pos.x = camera.pos.x - deltaX
      camera.pos.y = camera.pos.y - deltaY
      setCamera({ ...camera })
    }
  }

  const handleMouseDownNode = useCallback(
    (id: number, e: any) => {
      setSelectedNode(id)

      setClickedPosition({ x: e.clientX, y: e.clientY })

      const node = nodes.find((n) => n.id === id)
      if (node) {
        node.previousPosition = {
          x: node.currentPosition.x,
          y: node.currentPosition.y,
        }

        // Update input edges positions
        for (let i = 0; i < node.inputEdgeIds.length; i++) {
          const edgeId = node.inputEdgeIds[i]
          const edge = edges.find((edge) => edge.id === edgeId)
          console.log('update input edges', edges)
          console.log('update input nodes', nodes)
          console.log('update input', node)
          if (edge) {
            edge.previousEndPosition = {
              x: edge.currentEndPosition.x,
              y: edge.currentEndPosition.y,
            }
          }
        }

        // Update output edges positions
        for (let i = 0; i < node.outputEdgeIds.length; i++) {
          const edgeId = node.outputEdgeIds[i]
          const edge = edges.find((edge) => edge.id === edgeId)
          if (edge) {
            edge.previousStartPosition = {
              x: edge.currentStartPosition.x,
              y: edge.currentStartPosition.y,
            }
          }
        }
      }
    },
    [nodes, edges],
  )

  const handleMouseEnterInput = useCallback(
    (posX: number, posY: number, nodeId: number, inputIndex: number) => {
      setInInput({ nodeId, inputIndex, posX: posX, posY: posY })
      console.log('in input')
    },
    [],
  )

  const handleMouseDownOutput = useCallback(
    (posX: number, posY: number, nodeId: number, outputIndex: number) => {
      const prevStartPos = { x: posX, y: posY }
      const prevEndPos = { x: posX, y: posY }
      const curStartPos = { x: posX, y: posY }
      const curEndPos = { x: posX, y: posY }
      console.log('new edge', curStartPos)
      setNewEdge({
        id: '',
        nodeStartId: nodeId,
        outputIndex: outputIndex,
        nodeEndId: 0,
        inputIndex: -1,
        previousStartPosition: prevStartPos,
        previousEndPosition: prevEndPos,
        currentStartPosition: curStartPos,
        currentEndPosition: curEndPos,
      })
    },
    [],
  )

  const handleMouseLeaveInput = useCallback((nodeId: number, inputIndex: number) => {
    if (inInput?.nodeId === nodeId && inInput.inputIndex === inputIndex) {
      setInInput(null)
    }
  }, [])

  const backgroundWorldX: number = -camera.scale * camera.pos.x
  const backgroundWorldY: number = -camera.scale * camera.pos.y
  const backgroundWorldWidth: number = camera.scale * 30
  const backgroundWorldHeight: number = camera.scale * 30

  return (
    <div className='relative w-full h-full overflow-hidden border-2 border-red-400'>
      <div
        id='boardWrapper'
        className='absolute w-full h-full overflow-hidden top-0 left-0 border-0 border-blue-400'
      >
        <div
          id='board'
          onWheel={applyScale}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={(e) => {
            e.preventDefault()
            setGrabbingBoard(false)
          }}
          className='relative w-full  h-full   border-0 border-black overflow-hidden'
          style={{
            backgroundImage: 'radial-gradient(circle, #b8b8b8bf 1px, rgba(0,0,0,0) 1px',
            backgroundPosition: `${backgroundWorldX}px ${backgroundWorldY}px`,
            backgroundSize: `${backgroundWorldWidth}px ${backgroundWorldHeight}px`,
            cursor: grabbingBoard ? 'grab' : 'default',
          }}
        >
          {nodes.map((n: NodeData) => (
            <EditorNode
              id={n.id}
              nodeData={n}
              x={n.currentPosition.x}
              y={n.currentPosition.y}
              numInputs={n.numInputs}
              numOutputs={n.numOutputs}
              selected={selectedNode ? selectedNode == n.id : false}
              camera={camera}
              onMouseDown={handleMouseDownNode}
              onMouseEnterInput={handleMouseEnterInput}
              onMouseDownOutput={handleMouseDownOutput}
              onMouseLeaveInput={handleMouseLeaveInput}
              onCommitField={handleCommitField}
              onCommitEntityName={(entityName: string) => handleCommitEntityName(n, entityName)}
            ></EditorNode>
          ))}
          {newEdge && (
            <EditorEdge
              selected={false}
              isNew={true}
              position={{
                x0: newEdge.currentStartPosition.x,
                y0: newEdge.currentStartPosition.y,
                x1: newEdge.currentEndPosition.x,
                y1: newEdge.currentEndPosition.y,
              }}
              camera={camera}
              onClickDelete={() => {}}
              onMouseDownEdge={() => {}}
            ></EditorEdge>
          )}
          {edges.map((edge: EdgeData, i) => (
            <EditorEdge
              key={i}
              selected={false}
              isNew={false}
              position={{
                x0: edge.currentStartPosition.x,
                y0: edge.currentStartPosition.y,
                x1: edge.currentEndPosition.x,
                y1: edge.currentEndPosition.y,
              }}
              camera={camera}
              onMouseDownEdge={() => {}}
              onClickDelete={() => {}}
            ></EditorEdge>
          ))}
          {contextMenuPos && (
            <div
              style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
              className='absolute border-0 rounded-md z-40'
            >
              <BoardContextMenu
                onNewEntity={() => {
                  console.log('new Entity')
                  createNewEntity(contextMenuPos)
                }}
              ></BoardContextMenu>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SchemaEditor
