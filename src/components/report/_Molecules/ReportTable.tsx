import React from 'react'
import { IReportService } from '../IReportService'
import { useQuery } from '@tanstack/react-query'
import { LogicalExpression } from 'fusefx-repositorycontract'
import Table, { TableColumn } from '../../guifad/_Organisms/Table'
import { ReportDefinition } from '../ReportDefinition'
import { EntitySchema } from 'fusefx-modeldescription'

const ReportTable: React.FC<{
  reportService: IReportService
  report: ReportDefinition
  entitySchema: EntitySchema
}> = ({ reportService, report, entitySchema }) => {
  const yFields = ['count(1)', 'sum(duration)']
  const { isLoading, error, data } = useQuery({
    queryKey: ['report', report],
    queryFn: () => {
      try {
        return reportService.generateReport(report)
      } catch (error) {
        return null
      }
    },
  })

  if (isLoading) {
    return <div>Loading</div>
  }

  if (!data) {
    return <div>Loading</div>
  }

  const columns: TableColumn[] = []
  if (data.length == 0) {
    report.groupBy?.forEach((g) => {
      columns.push({ fieldName: g, fieldType: 'string', key: g, label: g, sortable: true })
    })
    report.reportValues?.forEach((v) => {
      columns.push({ fieldName: v, fieldType: 'string', key: v, label: v })
    })
  } else {
    const dataRef: any = data[0]
    Object.keys(dataRef).forEach((k) => {
      columns.push({ fieldName: k, fieldType: 'string', key: k, label: k })
    })
  }
  return (
    <div className='border-0 border-blue-500 h-full'>
      <Table columns={columns} records={data} onSortingParamsChange={() => {}}></Table>
    </div>
  )
}

export default ReportTable
