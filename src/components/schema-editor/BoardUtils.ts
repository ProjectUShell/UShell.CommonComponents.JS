import { SchemaRoot } from 'fusefx-modeldescription'
import { Camera } from './Camera'
import { Position } from './Position'
import { BoardState } from './BoardState'

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

export function getBoardStateFromSchema(schema: SchemaRoot): BoardState {
  const result: BoardState = new BoardState()
  const boardStateString: string | null = schema.designerData
  if (boardStateString && boardStateString != '') {
    const boardState: any = JSON.parse(boardStateString)
    result.nodes = boardState.nodes
    result.edges = boardState.edges
  }
  console.log('boardState', result.edges)
  return result
}

export function getSchemaFromBoardState(boardState: BoardState): SchemaRoot {
  const schema: SchemaRoot = new SchemaRoot()
  schema.entities = []
  schema.relations = []
  boardState.nodes.forEach((node) => {
    schema.entities.push(node.entitySchema)
  })
  boardState.edges.forEach((edge) => {
    schema.relations.push(edge.relation)
  })

  schema.designerData = JSON.stringify(boardState)
  return schema
}
