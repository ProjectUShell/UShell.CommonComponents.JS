export interface NodeData {
  id: string
  numInputs: number
  numOutputs: number
  previousPosition: { x: number; y: number }
  currentPosition: { x: number; y: number }
  inputEdgeIds: string[]
  outputEdgeIds: string[]
}
