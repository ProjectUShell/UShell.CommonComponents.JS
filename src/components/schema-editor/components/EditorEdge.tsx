import React from 'react'

const EditorEdge: React.FC<{
  selected: boolean
  isNew: boolean
  position: { x0: number; y0: number; x1: number; y1: number }
  onMouseDownEdge: () => void
  onClickDelete: () => void
}> = ({ selected, isNew, position, onMouseDownEdge, onClickDelete }) => {
  function handleMouseDownEdge(e: any) {
    e.stopPropagation()

    onMouseDownEdge()
  }

  function calculateOffset(value: number): number {
    return value / 2
  }

  return (
    <svg className='absolute top-0 left-0 w-full h-full pointer-events-none'>
      <path
        className={`pointer-events-auto stroke-2 stroke-pink-500 fill-transparent cursor-pointer
         ${selected ? 'stroke-orange-400' : ''}`}
        d={`M ${position.x0} ${position.y0} C ${
          position.x0 + calculateOffset(Math.abs(position.x1 - position.x0))
        } ${position.y0}, ${position.x1 - calculateOffset(Math.abs(position.x1 - position.x0))} ${
          position.y1
        }, ${position.x1} ${position.y1}`}
        onMouseDown={handleMouseDownEdge}
      />
    </svg>
  )
}

export default EditorEdge
