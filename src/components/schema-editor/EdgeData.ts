export interface EdgeData {
  id: string
  nodeStartId: number
  nodeEndId: number
  inputIndex: number
  outputIndex: number
  previousStartPosition: { x: number; y: number }
  currentStartPosition: { x: number; y: number }
  previousEndPosition: { x: number; y: number }
  currentEndPosition: { x: number; y: number }
}
