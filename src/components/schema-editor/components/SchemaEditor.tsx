import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { NodeData } from '../NodeData'
import { EntitySchema, FieldSchema, RelationSchema, SchemaRoot } from 'fusefx-modeldescription'
import EditorNode from './EditorNode'
import { EdgeData } from '../EdgeData'
import EditorEdge from './EditorEdge'
import { Camera } from '../Camera'
import BoardContextMenu from './BoardContextMenu'
import {
  getBoardPosFromWindowPos,
  getBoardStateFromSchema,
  getSchemaFromBoardState,
  getViewPosFromWorldPos,
  getWorldPosFromViewPos,
} from '../BoardUtils'
import { Position } from '../Position'
import EditorToolbar from './EditorToolbar'
import EditorProperties from './EditorProperties'
import { BoardState } from '../BoardState'

const SchemaEditor: React.FC<{
  schemaName: string
  schema: SchemaRoot
  onChangeSchemaName: (newName: string) => void
  onChangeSchema: (newSchema: SchemaRoot) => void
}> = ({ schemaName, schema, onChangeSchemaName, onChangeSchema }) => {
  const boardElement = document.getElementById('board')

  const [showProperties, setShowProperties] = useState(false)

  const [currentId, setCurrentId] = useState(1)
  const [grabbingBoard, setGrabbingBoard] = useState(false)
  const [camera, setCamera] = useState(new Camera())
  const [clickedPosition, setClickedPosition] = useState<any>({ x: -1, y: -1 })
  const [nodes, setNodes] = useState<NodeData[]>([])
  const [edges, setEdges] = useState<EdgeData[]>([])
  const [selectedNode, setSelectedNode] = useState<number | null>(null)
  const [selectedField, setSelectedField] = useState<FieldSchema | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<EdgeData | null>(null)

  const [newEdge, setNewEdge] = useState<EdgeData | null>(null)
  const [inInput, setInInput] = useState<{
    nodeId: number
    fieldName: string
    posX: number
    posY: number
  } | null>(null)

  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const pd = (e: any) => e.preventDefault()
    document.addEventListener('contextmenu', pd)

    const boardState: BoardState = getBoardStateFromSchema(schema)

    setNodes(boardState.nodes)
    setEdges(boardState.edges)
    let maxId: number = 0
    boardState.nodes.forEach((n: NodeData) => {
      if (n.id > maxId) {
        maxId = n.id
      }
    })
    setCurrentId(maxId + 1)
    return () => {
      document.removeEventListener('contextmenu', pd)
    }
  }, [schema])

  useEffect(() => {
    save()
  }, [nodes, edges])

  function save() {
    const boardState: any = {
      nodes: nodes,
      edges: edges,
    }
    localStorage.setItem('boardState', JSON.stringify(boardState))
  }

  function saveSchema() {
    const newEntitySchema: SchemaRoot = getSchemaFromBoardState({ nodes: nodes, edges: edges })
    onChangeSchema(newEntitySchema)
  }

  function createNewEntity(pos: Position): void {
    setContextMenuPos(null)
    const worldPos = getWorldPosFromViewPos(pos, camera)
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

  function handleCommitField(nodeData: NodeData, fieldSchema: FieldSchema, value: any) {
    const existingF: FieldSchema | undefined = nodeData.entitySchema.fields.find(
      (f: FieldSchema) => f.name == fieldSchema.name,
    )
    if (existingF) {
      existingF.name = value
    } else {
      nodeData.entitySchema.fields.push(fieldSchema)
    }
    save()
  }

  function handleDeleteField(nodeData: NodeData, fieldSchema: FieldSchema) {
    nodeData.entitySchema.fields = nodeData.entitySchema.fields.filter(
      (f) => f.name != fieldSchema.name,
    )
    save()
  }

  function handleCommitEntityName(nodeData: NodeData, entityName: string) {
    nodeData.entitySchema.name = entityName
    save()
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
    setSelectedEdge(null)
    setSelectedField(null)
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
        const edgeId: string = `edge_${nodeStart.id}_${newEdge.outputFieldName}_${nodeEnd.id}_${inInput.fieldName}`
        nodeStart.outputEdgeIds = [...nodeStart.outputEdgeIds, edgeId]
        nodeEnd.inputEdgeIds = [...nodeEnd.inputEdgeIds, edgeId]

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

        newEdge.relation.primaryEntityName = nodeEnd.entitySchema.name
        setEdges([
          ...edges,
          {
            ...newEdge,
            id: edgeId,
            nodeEndId: nodeEnd.id,
            inputFieldName: inInput.fieldName,
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
    const deltaX = (e.clientX - clickedPosition.x) / camera.scale
    const deltaY = (e.clientY - clickedPosition.y) / camera.scale
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
      setSelectedEdge(null)

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
    (posX: number, posY: number, nodeId: number, fieldName: string) => {
      setInInput({ nodeId, fieldName, posX: posX, posY: posY })
    },
    [],
  )

  const handleMouseDownOutput = useCallback(
    (posX: number, posY: number, nodeId: number, fieldName: string) => {
      const prevStartPos = { x: posX, y: posY }
      const prevEndPos = { x: posX, y: posY }
      const curStartPos = { x: posX, y: posY }
      const curEndPos = { x: posX, y: posY }
      const node: NodeData | undefined = nodes.find((n) => n.id == nodeId)
      if (!node) throw `No Node with id ${nodeId}`
      const relation: RelationSchema = new RelationSchema()
      relation.foreignEntityName = node.entitySchema.name
      relation.foreignKeyIndexName = fieldName
      setNewEdge({
        id: '',
        nodeStartId: nodeId,
        outputFieldName: fieldName,
        nodeEndId: 0,
        inputFieldName: '',
        previousStartPosition: prevStartPos,
        previousEndPosition: prevEndPos,
        currentStartPosition: curStartPos,
        currentEndPosition: curEndPos,
        relation: relation,
      })
    },
    [nodes],
  )

  const handleMouseLeaveInput = useCallback((nodeId: number, fieldName: string) => {
    if (inInput?.nodeId === nodeId && inInput.fieldName === fieldName) {
      setInInput(null)
    }
  }, [])

  const handleKeyDown = (e: any) => {
    if (e.key == 'Delete') {
      if (selectedNode) {
        setNodes(nodes.filter((n) => n.id != selectedNode))
        setSelectedNode(null)
      }
      if (selectedEdge) {
        setEdges(edges.filter((e) => e.id != selectedEdge.id))
      }
    }
  }

  const backgroundWorldX: number = -camera.scale * camera.pos.x
  const backgroundWorldY: number = -camera.scale * camera.pos.y
  const backgroundWorldWidth: number = camera.scale * 30
  const backgroundWorldHeight: number = camera.scale * 30

  console.log('edges', edges)
  return (
    <div className='flex flex-col w-full h-full overflow-hidden border-0 border-green-400'>
      <EditorToolbar
        showProperties={showProperties}
        setShowProperties={setShowProperties}
        schemaName={schemaName}
        setSchemaName={onChangeSchemaName}
        save={() => saveSchema()}
      ></EditorToolbar>
      <div className='flex w-full h-full overflow-hidden border-0 border-red-400'>
        <div className='relative w-full h-full overflow-hidden border-0 border-red-400'>
          <div
            id='boardWrapper'
            className='absolute w-full h-full overflow-hidden top-0 left-0 border-0 border-blue-400'
          >
            <div
              id='board'
              tabIndex={0}
              onWheel={applyScale}
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={(e) => {
                e.preventDefault()
                setGrabbingBoard(false)
              }}
              onKeyDown={(e) => handleKeyDown(e)}
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
                  key={n.id}
                  id={n.id}
                  nodeData={n}
                  x={n.currentPosition.x}
                  y={n.currentPosition.y}
                  numInputs={n.numInputs}
                  numOutputs={n.numOutputs}
                  selected={selectedNode ? selectedNode == n.id : false}
                  camera={camera}
                  onFieldSelected={(f: FieldSchema) => setSelectedField(f)}
                  onMouseDown={handleMouseDownNode}
                  onMouseEnterInput={handleMouseEnterInput}
                  onMouseDownOutput={handleMouseDownOutput}
                  onMouseLeaveInput={handleMouseLeaveInput}
                  onCommitField={(f: FieldSchema, v: any) => handleCommitField(n, f, v)}
                  onCommitEntityName={(entityName: string) => handleCommitEntityName(n, entityName)}
                  onDeleteField={(f) => handleDeleteField(n, f)}
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
                  selected={selectedEdge ? selectedEdge.id == edge.id : false}
                  isNew={false}
                  position={{
                    x0: edge.currentStartPosition.x,
                    y0: edge.currentStartPosition.y,
                    x1: edge.currentEndPosition.x,
                    y1: edge.currentEndPosition.y,
                  }}
                  camera={camera}
                  onMouseDownEdge={() => {
                    setSelectedField(null)
                    setSelectedNode(null)
                    setSelectedEdge(edge)
                  }}
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
                      createNewEntity(contextMenuPos)
                    }}
                  ></BoardContextMenu>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className={` ight-0 top-0 border-t text-sm py-2 border-bg5 dark:border-bg5dark bg-bg3 dark:bg-bg3dark z-0 transition-all ${
            showProperties ? 'w-64 h-full border-l px-2 ' : 'w-0 h-full'
          }`}
        >
          <EditorProperties
            entity={nodes.find((n) => n.id == selectedNode)?.entitySchema}
            field={selectedField}
            relation={selectedEdge?.relation}
            onChange={() => save()}
          ></EditorProperties>
        </div>
      </div>
    </div>
  )
}

export default SchemaEditor
