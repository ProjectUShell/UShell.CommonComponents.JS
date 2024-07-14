import { EntitySchema } from 'fusefx-modeldescription'
import { LogicalExpression } from 'fusefx-repositorycontract'
import { ReportDefinition } from './ReportDefinition'

export interface IReportService {
  generateReport(report: ReportDefinition): Promise<{ [key: string]: any }[]>

  getEntitySchema(): Promise<EntitySchema>
}
