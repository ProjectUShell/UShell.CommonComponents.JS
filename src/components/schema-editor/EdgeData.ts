export interface EdgeData {
  id: string
  nodeStartId: string
  nodeEndId: string
  inputIndex: number
  outputIndex: number
  previousStartPosition: { x: number; y: number }
  currentStartPosition: { x: number; y: number }
  previousEndPosition: { x: number; y: number }
  currentEndPosition: { x: number; y: number }
}
