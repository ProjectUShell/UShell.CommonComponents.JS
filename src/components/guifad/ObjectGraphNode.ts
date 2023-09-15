import { IDataSource } from '../../ushell-modulebase/lib/iDataSource'

export interface ObjectGraphNode {
  dataSource: IDataSource
  record: any | null
  parent: ObjectGraphNode | null
}
