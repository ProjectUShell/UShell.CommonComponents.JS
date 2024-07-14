import { ReportDefinition } from './ReportDefinition'

export interface IReportRepository {
  getReports(): Promise<ReportDefinition[]>
  addOrUpdateReport(report: ReportDefinition): Promise<ReportDefinition>
  deleteReport(report: ReportDefinition): Promise<void>
}
