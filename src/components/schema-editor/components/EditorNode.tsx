import React, { createRef, useEffect, useState } from 'react'
import { Camera } from '../Camera'
import { NodeData } from '../NodeData'
import { Position } from '../Position'
import {
  getBoardPosFromWindowPos,
  getViewPosFromWorldPos,
  getWorldPosFromViewPos,
} from '../BoardUtils'

const EditorNode: React.FC<{
  id: string
  nodeData: NodeData
  x: number
  y: number
  selected: boolean
  camera: Camera
  onMouseDown: (id: string, e: any) => void
  onMouseDownOutput: (posX: number, posY: number, nodeId: string, outputIndex: number) => void
  onMouseEnterInput: (posX: number, posY: number, nodeId: string, outputIndex: number) => void
  onMouseLeaveInput: (nodeId: string, outputIndex: number) => void
  numInputs: number
  numOutputs: number
}> = React.memo(
  ({
    id,
    nodeData,
    x,
    y,
    selected,
    camera,
    onMouseDown,
    onMouseDownOutput,
    onMouseEnterInput,
    onMouseLeaveInput,
    numInputs,
    numOutputs,
  }) => {
    const [entityName, setEntityName] = useState(nodeData.entitySchema.name)

    function handleMouseDownOutput(ref: any, e: any, index: number) {
      e.preventDefault()
      e.stopPropagation()
      if (!ref) return
      console.log('output down e', e)
      e.stopPropagation()
      const el: any = ref.current
      console.log('output down el', el.getBoundingClientRect())
      const centerX =
        el.getBoundingClientRect().left +
        Math.abs(el.getBoundingClientRect().right - el.getBoundingClientRect().left) / 2

      const centerY =
        el.getBoundingClientRect().top +
        Math.abs(el.getBoundingClientRect().bottom - el.getBoundingClientRect().top) / 2

      const windowPos: Position = { x: centerX, y: centerY }
      const viewPos = getBoardPosFromWindowPos(windowPos)
      const worldPos = getWorldPosFromViewPos(viewPos, camera)

      // onMouseDownOutput(centerX, el.getBoundingClientRect().bottom, id, index)
      // onMouseDownOutput(centerX + camera.pos.x, centerY + camera.pos.y, id, index)
      onMouseDownOutput(worldPos.x, worldPos.y, id, index)
      // onMouseDownOutput(e.clientX, e.clientY - 100, id, index)
      // onMouseDownOutput(e.clientX, ref.current.clientY, id, index)
    }

    function handleMouseEnterInput(ref: any, e: any, inputIndex: number) {
      e.preventDefault()
      e.stopPropagation()
      if (!ref) return
      console.log('output down e', e)
      e.stopPropagation()
      const el: any = ref.current
      console.log('output down el', el.getBoundingClientRect())
      const centerX =
        el.getBoundingClientRect().left +
        Math.abs(el.getBoundingClientRect().right - el.getBoundingClientRect().left) / 2

      const centerY =
        el.getBoundingClientRect().top +
        Math.abs(el.getBoundingClientRect().bottom - el.getBoundingClientRect().top) / 2

      const windowPos: Position = { x: centerX, y: centerY }
      const viewPos = getBoardPosFromWindowPos(windowPos)
      const worldPos = getWorldPosFromViewPos(viewPos, camera)

      onMouseEnterInput(worldPos.x, worldPos.y, id, inputIndex)
    }

    const viewPos: Position = getViewPosFromWorldPos({ x: x, y: y }, camera)
    const worldWidth: number = camera.scale * 120
    const worldHeight: number = camera.scale * 120

    // console.log('worldX', worldX)
    // transform: `translate(${x}px ${y}px`
    return (
      <div
        style={{
          width: `${worldWidth}px`,
          height: `${worldHeight}px`,
          transform: `translate(${viewPos.x}px, ${viewPos.y}px`,
        }}
        onMouseDown={(e: any) => {
          e.stopPropagation()

          onMouseDown(id, e)
        }}
        className={`flex flex-col absolute cursor-grab bg-bg2 dark:bg-bg2dark border-2 z-10 
        shadow-md hover:shadow-2xl selection:bg-blue-400 ${selected ? 'border-orange-400' : ''}`}
      >
        <input
          id='test123'
          value={entityName}
          onChange={(e) => setEntityName(e.target.value)}
          onMouseDown={(e: any) => {
            e.stopPropagation()

            onMouseDown(id, e)
          }}
          disabled={!selected}
          placeholder='EntityName'
          className='bg-bg3 dark:bg-bg3dark text-center p-1 border-1 mb-1'
        ></input>
        <input
          onMouseDown={(e: any) => {
            e.stopPropagation()

            onMouseDown(id, e)
          }}
          disabled={!selected}
          placeholder='New Field'
          className='bg-bg3 dark:bg-bg3dark text-center p-1'
        ></input>
        <div
          className='absolute top-0 -left-8 flex flex-col items-center justify-center gap-3 w-3 h-full
         pointer-events-none'
        >
          {[Array(Number(numInputs)).keys()].map((n, i) => {
            const inputRef: any = React.createRef()
            return (
              <div
                key={i}
                ref={inputRef}
                className='w-3 h-3 rounded-full bg-yellow-300 cursor-crosshair pointer-events-auto'
                onMouseEnter={(e) => handleMouseEnterInput(inputRef, e, i)}
                onMouseLeave={() => onMouseLeaveInput(id, i)}
              ></div>
            )
          })}
        </div>
        <div
          className='absolute top-0 -right-8 flex flex-col items-center justify-center
         gap-3 w-3 h-full pointer-events-none'
        >
          {[Array(Number(numOutputs)).keys()].map((n, i) => {
            const outputRef: any = createRef()
            return (
              <div
                key={i}
                ref={outputRef}
                className='w-3 h-3 rounded-full bg-yellow-300 
                  cursor-crosshair hover:bg-red-400 pointer-events-auto border-4 border-red-600'
                onMouseDown={(e) => handleMouseDownOutput(outputRef, e, i)}
              ></div>
            )
          })}
        </div>
      </div>
    )
  },
)

export default EditorNode
