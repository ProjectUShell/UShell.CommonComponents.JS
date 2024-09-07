import { LogicalExpression } from 'fusefx-repositorycontract'

type ChartType = 'Table' | 'Bar' | 'Pie' | 'Line' | 'Area' | 'Donut'

export class ReportChartDefinition {
  type: ChartType = 'Bar'
  groupBy?: string[]
  stackBy?: string[]
  reportValues?: string[]
  limit: number = 20
  sortedBy: string = ''
  name: string = ''
  folder: string = 'My Reports'
  horizontal: boolean = false
  multiAxis: boolean = false
  stacked: boolean = false
}

export class ReportDefinition extends ReportChartDefinition {
  filter?: LogicalExpression
}
