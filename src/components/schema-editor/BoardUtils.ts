import { Camera } from './Camera'
import { Position } from './Position'

export function getBoardPosFromWindowPos(windowPos: Position): Position {
  const boardEl: HTMLElement | null = document.getElementById('board')
  const widthDiff: number = boardEl!.clientWidth - window.innerWidth
  const heightDiff: number = boardEl!.clientHeight - window.innerHeight

  return {
    x: windowPos.x + widthDiff,
    y: windowPos.y + heightDiff,
  }
}

export function getViewPosFromWorldPos(boardPos: Position, cam: Camera): Position {
  return {
    x: cam.scale * (boardPos.x + cam.posX),
    y: cam.scale * (boardPos.y + cam.posY),
  }
}

export function getWorldPosFromViewPos(boardPos: Position, cam: Camera): Position {
  return {
    x: boardPos.x / cam.scale + cam.posX,
    y: boardPos.y / cam.scale + cam.posY,
  }
}
