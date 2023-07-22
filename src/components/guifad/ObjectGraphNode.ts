import { IDataSource } from 'ushell-modulebase'

export interface ObjectGraphNode {
  dataSource: IDataSource
  record: any | null
  parent: ObjectGraphNode | null
}
