import React, { createRef, useEffect, useState } from 'react'

const EditorNode: React.FC<{
  id: string
  x: number
  y: number
  selected: boolean
  onMouseDown: (id: string, e: any) => void
  onMouseDownOutput: (posX: number, posY: number, nodeId: string, outputIndex: number) => void
  onMouseEnterInput: (posX: number, posY: number, nodeId: string, outputIndex: number) => void
  onMouseLeaveInput: (nodeId: string, outputIndex: number) => void
  numInputs: number
  numOutputs: number
}> = React.memo(
  ({
    id,
    x,
    y,
    selected,
    onMouseDown,
    onMouseDownOutput,
    onMouseEnterInput,
    onMouseLeaveInput,
    numInputs,
    numOutputs,
  }) => {
    // const [x, setX] = useState(initialX)
    // const [y, setY] = useState(initialY)

    // useEffect(() => {
    //   setX(initialX)
    //   setY(initialY)
    // }, [initialX, initialY])

    function handleMouseDownOutput(ref: any, e: any, index: number) {
      e.preventDefault()
      e.stopPropagation()
      if (!ref) return
      console.log('output down', ref)
      e.stopPropagation()
      const el: any = ref.current
      const centerX =
        el.getBoundingClientRect().left +
        Math.abs(el.getBoundingClientRect().right - el.getBoundingClientRect().left) / 2

      const centerY =
        el.getBoundingClientRect().top +
        Math.abs(el.getBoundingClientRect().bottom - el.getBoundingClientRect().top) / 2

      onMouseDownOutput(centerX, centerY, id, index)
    }

    function handleMouseEnterInput(ref: any, inputIndex: number) {
      if (!ref) return
      const el: any = ref.current
      const centerX =
        el.getBoundingClientRect().left +
        Math.abs(el.getBoundingClientRect().right - el.getBoundingClientRect().left) / 2

      const centerY =
        el.getBoundingClientRect().top +
        Math.abs(el.getBoundingClientRect().bottom - el.getBoundingClientRect().top) / 2

      onMouseEnterInput(centerX, centerY, id, inputIndex)
    }
    // transform: `translate(${x}px ${y}px`
    return (
      <div
        style={{ width: '120px', height: '120px', transform: `translate(${x}px, ${y}px` }}
        onMouseDown={(e: any) => {
          e.stopPropagation()

          onMouseDown(id, e)
        }}
        className={`flex flex-col absolute cursor-grab bg-red-400 border-4 z-10 
        shadow-md hover:shadow-2xl selection:bg-blue-400 ${selected ? 'border-orange-400' : ''}`}
      >
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
                onMouseEnter={() => handleMouseEnterInput(inputRef, i)}
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
                  cursor-crosshair hover:bg-red-400 pointer-events-auto'
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
