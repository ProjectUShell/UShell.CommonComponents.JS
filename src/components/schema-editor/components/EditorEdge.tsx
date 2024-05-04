import React from 'react'
import { Camera } from '../Camera'
import { Position } from '../Position'
import { getBoardPosFromWindowPos } from '../BoardUtils'

const EditorEdge: React.FC<{
  selected: boolean
  isNew: boolean
  position: { x0: number; y0: number; x1: number; y1: number }
  camera: Camera
  onMouseDownEdge: () => void
  onClickDelete: () => void
}> = ({ selected, isNew, position, camera, onMouseDownEdge, onClickDelete }) => {
  function handleMouseDownEdge(e: any) {
    e.stopPropagation()

    onMouseDownEdge()
  }

  function calculateOffset(value: number): number {
    return value / 2
  }

  const startPos: Position = getBoardPosFromWindowPos({ x: position.x0, y: position.y0 })
  const endPos: Position = getBoardPosFromWindowPos({ x: position.x1, y: position.y1 })

  const boardEl: HTMLElement | null = document.getElementById('board')
  const widthDiff: number = boardEl!.clientWidth - window.innerWidth
  const heightDiff: number = boardEl!.clientHeight - window.innerHeight

  // let x0 = position.x0 + widthDiff
  // let x1 = position.x1 + widthDiff
  // let y0 = position.y0 + heightDiff
  // let y1 = position.y1 + heightDiff

  let x0 = position.x0
  let x1 = position.x1
  let y0 = position.y0
  let y1 = position.y1

  x0 = camera.scale * x0 - camera.scale * camera.pos.x
  x1 = camera.scale * x1 - camera.scale * camera.pos.x
  y0 = camera.scale * y0 - camera.scale * camera.pos.y
  y1 = camera.scale * y1 - camera.scale * camera.pos.y

  return (
    <svg className='absolute top-0 left-0 w-full h-full pointer-events-none border-0'>
      <path
        className={`pointer-events-auto stroke-2 stroke-pink-500 fill-transparent cursor-pointer
         ${selected ? 'stroke-orange-400' : ''}`}
        d={`M ${x0} ${y0} C ${x0 + calculateOffset(Math.abs(x1 - x0))} ${y0}, ${
          x1 - calculateOffset(Math.abs(x1 - x0))
        } ${y1}, ${x1} ${y1}`}
        onMouseDown={handleMouseDownEdge}
      />
    </svg>
  )
}

export default EditorEdge
