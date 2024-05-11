import React, { createRef, useEffect, useState } from 'react'
import { FieldSchema } from 'fusefx-modeldescription'
import { Camera } from '../Camera'
import { NodeData } from '../NodeData'
import { Position } from '../Position'
import {
  getBoardPosFromWindowPos,
  getViewPosFromWorldPos,
  getWorldPosFromViewPos,
} from '../BoardUtils'
import EditorNodeField from './EditorNodeField'

const EditorNode: React.FC<{
  id: number
  nodeData: NodeData
  x: number
  y: number
  selected: boolean
  camera: Camera
  onFieldSelected: (field: FieldSchema) => void
  onMouseDown: (id: number, e: any) => void
  onMouseDownOutput: (posX: number, posY: number, nodeId: number, fieldName: string) => void
  onMouseEnterInput: (posX: number, posY: number, nodeId: number, fieldName: string) => void
  onMouseLeaveInput: (nodeId: number, fieldName: string) => void
  onCommitField: (f: FieldSchema, value: any) => void
  onCommitEntityName: (entityName: string) => void
  onDeleteField: (f: FieldSchema) => void
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
    onFieldSelected,
    onMouseDown,
    onMouseDownOutput,
    onMouseEnterInput,
    onMouseLeaveInput,
    onCommitField,
    onCommitEntityName,
    onDeleteField,
    numInputs,
    numOutputs,
  }) => {
    const [entityName, setEntityName] = useState(nodeData.entitySchema.name)
    const [activeField, setActiveField] = useState('')
    const [inputMode, setInputMode] = useState(false)

    function handleCommitField(f: FieldSchema | null, value: any) {
      if (!value || value == '') return
      if (!f) {
        f = new FieldSchema()
        f.name = value
        f.type = 'String'
      }
      onCommitField(f, value)
    }

    function handleCommitEntityName(value: any) {
      nodeData.entitySchema.name = value
      onCommitEntityName(value)
    }

    function handleMouseDownOutput(ref: any, e: any, fieldName: string) {
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
      onMouseDownOutput(worldPos.x, worldPos.y, id, fieldName)
      // onMouseDownOutput(e.clientX, e.clientY - 100, id, index)
      // onMouseDownOutput(e.clientX, ref.current.clientY, id, index)
    }

    function handleMouseEnterInput(ref: any, e: any, fieldName: string) {
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

      onMouseEnterInput(worldPos.x, worldPos.y, id, fieldName)
    }

    function handleKeyDownInput(field: FieldSchema | null, e: any) {
      e.stopPropagation()
      if (e.key == 'Enter') {
        handleCommitField(field, e.target.value)
        const el: any = document.getElementById(nodeData.entitySchema.name + '_new')
        if (el) {
          el.value = ''
          el.focus()
        }
        if (!field) {
          setInputMode((i) => !i)
        }
      }
      if (e.key == 'Delete' && field) {
        onDeleteField(field)
        // nodeData.entitySchema.fields = nodeData.entitySchema.fields.filter(
        //   (f) => f.name != field.name,
        // )
      }
      if (!inputMode && field) {
        setInputMode(true)
      }
    }

    function handleKeyDownEntityName(e: any) {
      if (e.key == 'Enter') {
        let el: any = document.getElementById(nodeData.entitySchema.name + '_new')
        if (!el) {
          el = document.getElementById(e.target.value + '_new')
        }
        el.value = ''
        el.focus()
        setInputMode((i) => !i)
        onCommitEntityName(e.target.value)
      }
      if (!inputMode) {
        setInputMode(true)
      }
    }

    const viewPos: Position = getViewPosFromWorldPos({ x: x, y: y }, camera)
    const worldWidth: number = camera.scale * 120
    const worldHeightField: number = camera.scale * 30

    // console.log('active field', activeField)

    return (
      <div
        style={{
          width: `${worldWidth}px`,
          height: `${worldHeightField * (3 + nodeData.entitySchema.fields.length)}px`,
          transform: `translate(${viewPos.x}px, ${viewPos.y}px`,
        }}
        onMouseDown={(e: any) => {
          e.stopPropagation()

          onMouseDown(id, e)
        }}
        onBlur={() => {
          setInputMode(false)
          setActiveField('')
        }}
        className={`flex flex-col absolute rounded-md cursor-grab bg-bg2 dark:bg-bg3dark border-2 z-10 
        shadow-md hover:shadow-2xl ${
          selected ? 'border-orange-400' : 'border-bg5 dark:border-bg5dark'
        }`}
      >
        <input
          id='test123'
          value={entityName}
          onChange={(e) => setEntityName(e.target.value)}
          onMouseDown={(e: any) => {
            e.stopPropagation()

            onMouseDown(id, e)
          }}
          onKeyDown={(e: any) => handleKeyDownEntityName(e)}
          readOnly={!(activeField == '' && inputMode)}
          onBlur={(e) => onCommitEntityName(e.target.value)}
          placeholder='EntityName'
          style={{
            width: `${worldWidth - 4}px`,
            height: `${worldHeightField}px`,
            fontSize: worldHeightField / 2.5,
          }}
          className={`bg-bg2 dark:bg-bg3dark text-center p-1 border-0 cursor-grab border-b-2 border-bg5 dark:border-bg5dark outline-none rounded-t-md`}
        ></input>
        {nodeData.entitySchema.fields.map((f) => {
          const inputRef: any = React.createRef()
          const outputRef: any = createRef()
          return (
            <div key={f.name} className='relative'>
              <input
                onMouseDown={(e: any) => {
                  e.stopPropagation()
                  console.log('mouse down field')
                  if (f.name != activeField) {
                    setInputMode(false)
                  }
                  onFieldSelected(f)
                  setActiveField(f.name)
                  onMouseDown(id, e)
                }}
                onFocus={() => setActiveField(f.name)}
                readOnly={f.name != activeField || !inputMode}
                defaultValue={f.name}
                onKeyDown={(e: any) => handleKeyDownInput(f, e)}
                onBlur={(e) => {
                  console.log('blur field')
                  e.preventDefault()
                  // e.stopPropagation()
                  handleCommitField(f, e.target.value)
                }}
                placeholder='New Field'
                style={{
                  width: `${worldWidth - 4}px`,
                  height: `${worldHeightField}px`,
                  fontSize: worldHeightField / 2.5,
                }}
                className={` text-center p-1 rounded-none outline-none cursor-default ${
                  activeField == f.name
                    ? 'bg-bg3 dark:bg-bg4dark'
                    : 'bg-bg2 dark:bg-bg3dark select-none'
                }`}
              ></input>
              <div
                style={{
                  top: worldHeightField / 2 - worldHeightField / 6,
                  width: worldHeightField / 3,
                  height: worldHeightField / 3,
                }}
                ref={inputRef}
                className='absolute left-0 rounded-r-full bg-green-300 
                  cursor-crosshair hover:bg-red-400 pointer-events-auto'
                onMouseEnter={(e) => handleMouseEnterInput(inputRef, e, f.name)}
                onMouseLeave={() => onMouseLeaveInput(id, f.name)}
              ></div>
              <div
                style={{
                  top: worldHeightField / 2 - worldHeightField / 6,
                  width: worldHeightField / 3,
                  height: worldHeightField / 3,
                }}
                ref={outputRef}
                className='absolute right-0 rounded-l-full bg-yellow-300 
                  cursor-crosshair hover:bg-red-400 pointer-events-auto'
                onMouseDown={(e) => handleMouseDownOutput(outputRef, e, f.name)}
              ></div>
            </div>
          )
        })}
        <input
          id={nodeData.entitySchema.name + '_new'}
          onMouseDown={(e: any) => {
            e.stopPropagation()

            onMouseDown(id, e)
          }}
          onKeyDown={(e: any) => {
            handleKeyDownInput(null, e)
          }}
          onBlur={(e) => {
            handleCommitField(null, e.target.value)
            e.target.value = ''
          }}
          placeholder='New Field'
          style={{
            width: `${worldWidth - 4}px`,
            height: `${worldHeightField}px`,
            fontSize: worldHeightField / 2.5,
          }}
          className='bg-bg2 dark:bg-bg3dark text-center p-1 rounded-none outline-none'
        ></input>
        {/* <div
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
        </div> */}
        {/* <div
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
        </div> */}
      </div>
    )
  },
)

export default EditorNode
