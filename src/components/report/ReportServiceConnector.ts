import { LogicalExpression } from 'fusefx-repositorycontract'
import { IReportService } from './IReportService'
import { EntitySchema } from 'fusefx-modeldescription'
import { ReportDefinition } from './ReportDefinition'

export class ReportServiceConnector implements IReportService {
  private _Url: string
  constructor(url: string) {
    this._Url = url
  }

  generateReport(report: ReportDefinition): Promise<{ [key: string]: any }[]> {
    return fetch(this._Url + '/GenerateReport', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: report.filter || new LogicalExpression(),
        groupBy: report.groupBy,
        stackBy: report.stackBy,
        reportValues: report.reportValues,
      }),
    })
      .then((r: any) => {
        return r.json()
      })
      .then((r) => {
        return r.return
      })
  }

  getEntitySchema(): Promise<EntitySchema> {
    return fetch(this._Url + '/GetEntitySchema', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((r: any) => {
        return r.json()
      })
      .then((r) => {
        return r.return
      })
  }
}
