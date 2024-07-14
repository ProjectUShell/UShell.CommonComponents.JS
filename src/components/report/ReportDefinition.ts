import { LogicalExpression } from 'fusefx-repositorycontract'

export class ReportChartDefinition {
  type: 'Table' | 'Bar' | 'Pie' = 'Bar'
  groupBy?: string[]
  stackBy?: string[]
  reportValues?: string[]
  name: string = ''
  folder: string = 'My Reports'
}

export class ReportDefinition extends ReportChartDefinition {
  filter?: LogicalExpression
}
