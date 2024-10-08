import React from 'react'
import { IReportService } from '../IReportService'
import { ReportServiceConnector } from '../ReportServiceConnector'
import {
  QueryClient,
  QueryClientContext,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { ReportDefinition } from '../ReportDefinition'
import ReportBarChart from './ReportBarChart'
import ReportLineChart from './ReportLineChart'
import ReportAreaChart from './ReportAreaChart'
import ReportPieChart from './ReportPieChart'
import { PagingParams, SortingField } from 'fusefx-repositorycontract'
import ReportBarChart2 from './ReportBarChart2'
import ReportPieChart2 from './ReportPieChart2'
import ReportLineChart2 from './ReportLineChart2'
import ReportAreaChart2 from './ReportAreaChart2'

const ReportChart: React.FC<{ reportServiceUrl: string; dark: boolean }> = ({
  reportServiceUrl,
  dark,
}) => {
  return (
    <ReportChart1
      reportService={new ReportServiceConnector(reportServiceUrl)}
      report={new ReportDefinition()}
      dark={dark}
    ></ReportChart1>
  )
}

export const ReportChart1: React.FC<{
  reportService: IReportService
  report: ReportDefinition
  dark: boolean
}> = ({ reportService, report, dark }) => {
  const qcc: any = QueryClientContext
  if (!qcc._currentValue) {
    return (
      <QueryClientProvider client={new QueryClient()}>
        <ReportChart1Inner
          reportService={reportService}
          report={report}
          dark={dark}
        ></ReportChart1Inner>
      </QueryClientProvider>
    )
  }
  return (
    <ReportChart1Inner
      reportService={reportService}
      report={report}
      dark={dark}
    ></ReportChart1Inner>
  )
}

export const ReportChart1Inner: React.FC<{
  reportService: IReportService
  report: ReportDefinition
  dark: boolean
}> = ({ reportService, report, dark }) => {
  // const yFields = ['count(1)', 'sum(duration)']
  const { isLoading, error, data } = useQuery({
    queryKey: [`report_${report.name}`, report],
    queryFn: () => {
      try {
        return reportService.generateReport(report, [report.sortedBy], report.limit, 0)
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

  const yValues: string[] = []
  const dataRef: any = data?.page && data.page.length > 0 ? data.page[0] : {}
  Object.keys(dataRef).forEach((k) => {
    if (!(report.groupBy?.includes(k) || report.stackBy?.includes(k))) {
      yValues.push(k)
    }
  })
  return (
    <div className='h-full w-full max-h-full border-0 border-blue-500 flex overflow-auto'>
      {report.type == 'Bar' && (
        <ReportBarChart2
          data={data.page}
          groupBy={report.groupBy || []}
          stackBy={report.stackBy || []}
          reportValues={report.reportValues || []}
          horizontal={report.horizontal}
          dark={dark}
        ></ReportBarChart2>
      )}
      {/* {report.type == 'Line' && (
        <ReportLineChart
          data={data.page}
          xFields={report.groupBy || []}
          yGroups={report.reportValues || []}
          yFields={yValues}
          multiAxis={report.multiAxis}
        ></ReportLineChart>
      )} */}
      {report.type == 'Line' && (
        <ReportLineChart2
          data={data.page}
          groupBy={report.groupBy || []}
          reportValues={report.reportValues || []}
          stackBy={report.stackBy || []}
          dark={dark}
        ></ReportLineChart2>
      )}
      {/* {report.type == 'Area' && (
        <ReportAreaChart
          data={data.page}
          xFields={report.groupBy || []}
          yGroups={report.reportValues || []}
          yFields={yValues}
          stacked={report.stacked}
        ></ReportAreaChart>
      )} */}
      {report.type == 'Area' && (
        <ReportAreaChart2
          data={data.page}
          groupBy={report.groupBy || []}
          reportValues={report.reportValues || []}
          stackBy={report.stackBy || []}
          dark={dark}
        ></ReportAreaChart2>
      )}
      {/* {report.type == 'Pie' && (
        <ReportPieChart
          data={data.page}
          xFields={report.groupBy || []}
          yGroups={report.reportValues || []}
          yFields={yValues}
          donut={false}
        ></ReportPieChart>
      )} */}
      {report.type == 'Pie' && (
        <ReportPieChart2
          data={data.page}
          groupBy={report.groupBy || []}
          stackBy={report.stackBy || []}
          reportValues={report.reportValues || []}
          dark={dark}
          donut={false}
        ></ReportPieChart2>
      )}
      {report.type == 'Donut' && (
        <ReportPieChart2
          data={data.page}
          groupBy={report.groupBy || []}
          stackBy={report.stackBy || []}
          reportValues={report.reportValues || []}
          dark={dark}
          donut={true}
        ></ReportPieChart2>
      )}
    </div>
  )
}

export default ReportChart
