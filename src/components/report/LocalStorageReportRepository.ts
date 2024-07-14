import { IReportRepository } from './IReportRepository'
import { ReportDefinition } from './ReportDefinition'

export class LocalStorageReportRepository implements IReportRepository {
  getReports(): Promise<ReportDefinition[]> {
    return new Promise<ReportDefinition[]>((resolve) => {
      const resLs: string | null = localStorage.getItem('LocalStorageReportRepository')
      if (!resLs) {
        return resolve([])
      }
      const res: ReportDefinition[] = JSON.parse(resLs)
      return resolve(res)
    })
  }
  addOrUpdateReport(report: ReportDefinition): Promise<ReportDefinition> {
    console.log('addreport', report)
    const resLs: string | null = localStorage.getItem('LocalStorageReportRepository')
    let repo: ReportDefinition[] = []
    if (resLs) {
      repo = JSON.parse(resLs)
    }
    const existingInd: number = repo.findIndex((r) => r.name == report.name)
    if (existingInd >= 0) {
      repo = repo.slice(existingInd)
    }
    repo.push(report)
    localStorage.setItem('LocalStorageReportRepository', JSON.stringify(repo))
    return new Promise<ReportDefinition>((resolve) => resolve(report))
  }

  deleteReport(report: ReportDefinition): Promise<void> {
    const resLs: string | null = localStorage.getItem('LocalStorageReportRepository')
    let repo: ReportDefinition[] = []
    if (resLs) {
      repo = JSON.parse(resLs)
    }
    const existingInd: number = repo.findIndex((r) => r.name == report.name)
    if (existingInd >= 0) {
      repo = repo.slice(existingInd)
    }
    return new Promise<void>((resolve) => resolve())
  }
}
