import { EntitySchema } from 'fusefx-modeldescription'
import { LogicalExpression } from 'fusefx-repositorycontract'
import { ReportDefinition } from './ReportDefinition'

export interface IReportService {
  generateReport(
    report: ReportDefinition,
    sortedBy: string[],
    limit: number,
    skip: number,
  ): Promise<{ page: { [key: string]: any }[]; totalCount: number }>

  getEntitySchema(): Promise<EntitySchema>
}
