import React, { useMemo, useState } from 'react'
import { IReportService } from '../IReportService'
import { useQuery } from '@tanstack/react-query'
import { LogicalExpression, PagingParams, SortingField } from 'fusefx-repositorycontract'
import Table, { TableColumn } from '../../guifad/_Organisms/Table'
import { ReportDefinition } from '../ReportDefinition'
import { EntitySchema } from 'fusefx-modeldescription'

const ReportTable: React.FC<{
  reportService: IReportService
  report: ReportDefinition
  entitySchema: EntitySchema
}> = ({ reportService, report, entitySchema }) => {
  const [sortingParams, setSortingParams] = useState<SortingField[]>([])
  const [pagingParams, setPagingParams] = useState<PagingParams>({ pageNumber: 1, pageSize: 100 })

  const { isLoading, error, data } = useQuery({
    queryKey: ['report', report, sortingParams, pagingParams],
    queryFn: () => {
      try {
        return reportService.generateReport(
          report,
          sortingParams.map((sp) => (sp.descending ? '^' + sp.fieldName : sp.fieldName)),
          pagingParams.pageSize,
          (pagingParams.pageNumber - 1) * pagingParams.pageSize,
        )
      } catch (error) {
        return null
      }
    },
  })

  const columns = useMemo(() => {
    const c: TableColumn[] = []
    if (!data?.page) return []
    if (data.page?.length == 0) {
      report.groupBy?.sort().forEach((g) => {
        c.push({ fieldName: g, fieldType: 'string', key: g, label: g, sortable: true })
      })
      report.reportValues?.sort().forEach((v) => {
        c.push({ fieldName: v, fieldType: 'string', key: v, label: v, sortable: false })
      })
    } else {
      const dataRef: any = data.page[0]
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

  function applyLocalSorting(): any[] {
    if (!data) return []
    let result: any[] = data.page
    for (let sortingField of sortingParams) {
      result = result?.sort((a, b) => {
        if (!(sortingField.fieldName in a)) {
          return b
        }
        if (!(sortingField.fieldName in b)) {
          return a
        }
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
        records={data.page || []}
        onSortingParamsChange={(sp, csp) => {
          setSortingParams([csp])
        }}
        initialSortingParams={sortingParams}
        pagingParams={pagingParams}
        onPagingParamsChange={(pp) => setPagingParams(pp)}
        totalCount={data.totalCount}
      ></Table>
    </div>
  )
}

export default ReportTable
