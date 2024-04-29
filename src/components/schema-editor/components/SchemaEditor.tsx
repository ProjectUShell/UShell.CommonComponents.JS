import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { NodeData } from '../NodeData'
import EditorNode from './EditorNode'
import { EdgeData } from '../EdgeData'
import EditorEdge from './EditorEdge'

const SchemaEditor: React.FC = () => {
  const boardElement = document.getElementById('board')

  const [grabbingBoard, setGrabbingBoard] = useState(false)
  const [scale, setScale] = useState<number>(1)
  const [clickedPosition, setClickedPosition] = useState<any>({ x: -1, y: -1 })
  const [nodes, setNodes] = useState<NodeData[]>([createNode(), createNode2()])
  const [edges, setEdges] = useState<EdgeData[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  const [newEdge, setNewEdge] = useState<EdgeData | null>(null)
  const [inInput, setInInput] = useState<{
    nodeId: string
    inputIndex: number
    posX: number
    posY: number
  } | null>(null)

  function createEdge(): EdgeData {
    return {
      currentStartPosition: { x: 20, y: 20 },
      currentEndPosition: { x: 240, y: 240 },
      id: 'testEdge1',
      inputIndex: 0,
      nodeEndId: 'Test2',
      nodeStartId: 'Test',
      outputIndex: 0,
      previousStartPosition: { x: 20, y: 20 },
      previousEndPosition: { x: 240, y: 240 },
    }
  }

  function createNode(): NodeData {
    const result: NodeData = {
      id: 'test',
      numInputs: 2,
      numOutputs: 2,
      currentPosition: { x: 160, y: 160 },
      previousPosition: { x: 160, y: 160 },
      inputEdgeIds: [],
      outputEdgeIds: [],
    }
    return result
  }
  function createNode2(): NodeData {
    const result: NodeData = {
      id: 'test2',
      numInputs: 2,
      numOutputs: 2,
      currentPosition: { x: 360, y: 360 },
      previousPosition: { x: 360, y: 360 },
      inputEdgeIds: [],
      outputEdgeIds: [],
    }
    return result
  }

  function applyScale2(e: any) {
    if (!boardElement) return
    let newScale = scale + e.deltaY * -0.0005
    if (newScale > 2) newScale = 2
    if (newScale < 1) newScale = 1
    setScale(newScale)
    boardElement.style.transform = `scale(${newScale})`
    boardElement.style.marginTop = `${(newScale - 1) * 50}vh`
    boardElement.style.marginLeft = `${(newScale - 1) * 50}vw`
  }

  function onMouseDownBoard(e: any) {
    setSelectedNode(null)

    e.preventDefault()
    setGrabbingBoard(true)
    setClickedPosition({ x: e.clientX, y: e.clientY })
  }

  function onMouseUp(e: any) {
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

        newEdge.previousStartPosition = {
          x: newEdge.currentStartPosition.x / scale,
          y: newEdge.currentStartPosition.y / scale,
        }
        newEdge.previousEndPosition = {
          x: inInput.posX / scale,
          y: inInput.posY / scale,
        }
        newEdge.currentEndPosition = {
          x: inInput.posX / scale,
          y: inInput.posY / scale,
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

  function onMouseMove(e: any) {
    if (newEdge) {
      newEdge.currentEndPosition = { x: e.clientX / scale, y: e.clientY / scale }
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
          x: (node.previousPosition.x + deltaX) / scale,
          y: (node.previousPosition.y + deltaY) / scale,
        }
        setNodes([...nodes])

        // update edge positions
        for (let i = 0; i < node.inputEdgeIds.length; i++) {
          const edgeId = node.inputEdgeIds[i]
          const edge = edges.find((edge) => edge.id === edgeId)
          if (!edge) continue
          edge.currentEndPosition = {
            x: (edge.previousEndPosition.x + deltaX) / scale,
            y: (edge.previousEndPosition.y + deltaY) / scale,
          }
        }

        for (let i = 0; i < node.outputEdgeIds.length; i++) {
          const edgeId = node.outputEdgeIds[i]
          const edge = edges.find((edge) => edge.id === edgeId)
          if (!edge) continue
          edge.currentStartPosition = {
            x: (edge.previousStartPosition.x + deltaX) / scale,
            y: (edge.previousStartPosition.y + deltaY) / scale,
          }
        }
      }
    } else {
      const boardWrapperElement = document.getElementById('boardWrapper')
      if (!boardWrapperElement) return
      boardWrapperElement.scrollBy(-deltaX, -deltaY)
      setClickedPosition({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseDownNode = useCallback((id: string, e: any) => {
    setSelectedNode(id)

    setClickedPosition({ x: e.clientX, y: e.clientY })

    const node = nodes.find((n) => n.id === id)
    if (node) {
      node.previousPosition = {
        x: node.currentPosition.x * scale,
        y: node.currentPosition.y * scale,
      }

      // Update input edges positions
      for (let i = 0; i < node.inputEdgeIds.length; i++) {
        const edgeId = node.inputEdgeIds[i]
        const edge = edges.find((edge) => edge.id === edgeId)
        if (edge) {
          edge.previousEndPosition = {
            x: edge.currentEndPosition.x * scale,
            y: edge.currentEndPosition.y * scale,
          }
        }
      }

      // Update output edges positions
      for (let i = 0; i < node.outputEdgeIds.length; i++) {
        const edgeId = node.outputEdgeIds[i]
        const edge = edges.find((edge) => edge.id === edgeId)
        if (edge) {
          edge.previousStartPosition = {
            x: edge.currentStartPosition.x * scale,
            y: edge.currentStartPosition.y * scale,
          }
        }
      }
    }
  }, [])

  const handleMouseEnterInput = useCallback(
    (posX: number, posY: number, nodeId: string, inputIndex: number) => {
      setInInput({ nodeId, inputIndex, posX: posX, posY: posY })
      console.log('in input')
    },
    [],
  )

  const handleMouseDownOutput = useCallback(
    (posX: number, posY: number, nodeId: string, outputIndex: number) => {
      const prevStartPos = { x: posX / scale, y: posY / scale }
      const prevEndPos = { x: posX / scale, y: posY / scale }
      const curStartPos = { x: posX / scale, y: posY / scale }
      const curEndPos = { x: posX / scale, y: posY / scale }
      console.log('new edge', curStartPos)
      setNewEdge({
        id: '',
        nodeStartId: nodeId,
        outputIndex: outputIndex,
        nodeEndId: '',
        inputIndex: -1,
        previousStartPosition: prevStartPos,
        previousEndPosition: prevEndPos,
        currentStartPosition: curStartPos,
        currentEndPosition: curEndPos,
      })
    },
    [],
  )

  const handleMouseLeaveInput = useCallback((nodeId: string, inputIndex: number) => {
    if (inInput?.nodeId === nodeId && inInput.inputIndex === inputIndex) {
      setInInput(null)
    }
  }, [])

  // function handle
  // console.log('render board', nodes)
  return (
    <div className='relative w-full h-full overflow-auto border-0 border-red-400'>
      <div
        id='boardWrapper'
        className='absolute w-full h-full overflow-auto top-0 left-0 border-0 border-blue-400'
      >
        <div
          id='board'
          onWheel={applyScale2}
          onMouseMove={onMouseMove}
          onMouseDown={onMouseDownBoard}
          onMouseUp={onMouseUp}
          onMouseLeave={(e) => {
            e.preventDefault()
            setGrabbingBoard(false)
          }}
          className='relative w-full  h-full   border-0 border-black overflow-auto'
          style={{
            backgroundImage: 'radial-gradient(circle, #b8b8b8bf 1px, rgba(0,0,0,0) 1px',
            backgroundSize: '30px 30px',
            cursor: grabbingBoard ? 'grab' : 'default',
          }}
        >
          {nodes.map((n: NodeData) => (
            <EditorNode
              id={n.id}
              x={n.currentPosition.x}
              y={n.currentPosition.y}
              numInputs={n.numInputs}
              numOutputs={n.numOutputs}
              selected={selectedNode ? selectedNode == n.id : false}
              onMouseDown={handleMouseDownNode}
              onMouseEnterInput={handleMouseEnterInput}
              onMouseDownOutput={handleMouseDownOutput}
              onMouseLeaveInput={handleMouseLeaveInput}
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
              onMouseDownEdge={() => {}}
              onClickDelete={() => {}}
            ></EditorEdge>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SchemaEditor
