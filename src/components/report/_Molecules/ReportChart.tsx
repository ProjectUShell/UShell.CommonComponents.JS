import React from 'react'
import { IReportService } from '../IReportService'
import { ReportServiceConnector } from '../ReportServiceConnector'
import { useQuery } from '@tanstack/react-query'
import { ReportDefinition } from '../ReportDefinition'
import ReportBarChart from './ReportBarChart'
import ReportLineChart from './ReportLineChart'
import ReportAreaChart from './ReportAreaChart'
import ReportPieChart from './ReportPieChart'

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
  // const yFields = ['count(1)', 'sum(duration)']
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

  const yValues: string[] = []
  const dataRef: any = data[0]
  Object.keys(dataRef).forEach((k) => {
    if (!(report.groupBy?.includes(k) || report.stackBy?.includes(k))) {
      yValues.push(k)
    }
  })
  return (
    <div className='h-full w-full max-h-full border-0 border-blue-500 flex overflow-auto'>
      {report.type == 'Bar' && (
        <ReportBarChart
          data={data}
          xFields={report.groupBy || []}
          yGroups={report.reportValues || []}
          yFields={yValues}
          horizontal={report.horizontal}
          dark={dark}
        ></ReportBarChart>
      )}
      {report.type == 'Line' && (
        <ReportLineChart
          data={data}
          xFields={report.groupBy || []}
          yGroups={report.reportValues || []}
          yFields={yValues}
          multiAxis={report.multiAxis}
        ></ReportLineChart>
      )}
      {report.type == 'Area' && (
        <ReportAreaChart
          data={data}
          xFields={report.groupBy || []}
          yGroups={report.reportValues || []}
          yFields={yValues}
          stacked={report.stacked}
        ></ReportAreaChart>
      )}
      {report.type == 'Pie' && (
        <ReportPieChart
          data={data}
          xFields={report.groupBy || []}
          yGroups={report.reportValues || []}
          yFields={yValues}
          donut={false}
        ></ReportPieChart>
      )}
      {report.type == 'Donut' && (
        <ReportPieChart
          data={data}
          xFields={report.groupBy || []}
          yGroups={report.reportValues || []}
          yFields={yValues}
          donut={true}
        ></ReportPieChart>
      )}
    </div>
  )
}

export default ReportChart
