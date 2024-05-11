import { Camera } from './Camera'
import { Position } from './Position'

export function getBoardPosFromWindowPos(windowPos: Position): Position {
  const boardEl: HTMLElement | null = document.getElementById('board')
  const widthDiff: number = boardEl!.getBoundingClientRect().x
  const heightDiff: number = boardEl!.getBoundingClientRect().y

  return {
    x: windowPos.x - widthDiff,
    y: windowPos.y - heightDiff,
  }
}

export function getViewPosFromWorldPos(boardPos: Position, cam: Camera): Position {
  return {
    x: cam.scale * (boardPos.x - cam.pos.x),
    y: cam.scale * (boardPos.y - cam.pos.y),
  }
}

export function getWorldPosFromViewPos(boardPos: Position, cam: Camera): Position {
  return {
    x: boardPos.x / cam.scale + cam.pos.x,
    y: boardPos.y / cam.scale + cam.pos.y,
  }
}
