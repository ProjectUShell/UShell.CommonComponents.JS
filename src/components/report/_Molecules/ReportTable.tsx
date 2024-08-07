import React, { useMemo, useState } from 'react'
import { IReportService } from '../IReportService'
import { useQuery } from '@tanstack/react-query'
import { LogicalExpression, SortingField } from 'fusefx-repositorycontract'
import Table, { TableColumn } from '../../guifad/_Organisms/Table'
import { ReportDefinition } from '../ReportDefinition'
import { EntitySchema } from 'fusefx-modeldescription'

const ReportTable: React.FC<{
  reportService: IReportService
  report: ReportDefinition
  entitySchema: EntitySchema
}> = ({ reportService, report, entitySchema }) => {
  const [sortingParams, setSortingParams] = useState<SortingField[]>([])

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

  const columns = useMemo(() => {
    const c: TableColumn[] = []
    if (!data) return []
    if (data.length == 0) {
      report.groupBy?.sort().forEach((g) => {
        c.push({ fieldName: g, fieldType: 'string', key: g, label: g, sortable: true })
      })
      report.reportValues?.sort().forEach((v) => {
        c.push({ fieldName: v, fieldType: 'string', key: v, label: v, sortable: false })
      })
    } else {
      const dataRef: any = data[0]
      Object.keys(dataRef).forEach((k) => {
        c.push({ fieldName: k, fieldType: 'string', key: k, label: k, sortable: true })
      })
    }
    return c
  }, [data, report])

  if (isLoading) {
    return <div>Loading</div>
  }

  if (!data) {
    return <div>Loading</div>
  }

  function applySorting(): any[] {
    if (!data) return []
    let result: any[] = data
    for (let sortingField of sortingParams) {
      result = result?.sort((a, b) => {
        const as: string = a[sortingField.fieldName].toString()
        const bs: string = b[sortingField.fieldName].toString()
        if (sortingField.descending) {
          return bs.localeCompare(as)
        }
        return as.localeCompare(bs)
      })
    }
    return result
  }

  return (
    <div className='border-0 border-blue-500 h-full'>
      <Table
        columns={columns}
        records={applySorting()}
        onSortingParamsChange={(sp, csp) => {
          setSortingParams([csp])
        }}
        initialSortingParams={sortingParams}
      ></Table>
    </div>
  )
}

export default ReportTable
