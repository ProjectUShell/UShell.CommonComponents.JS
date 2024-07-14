import React from 'react'
import { IReportService } from '../IReportService'
import { ReportServiceConnector } from '../ReportServiceConnector'
import { useQuery } from '@tanstack/react-query'
import { LogicalExpression } from 'fusefx-repositorycontract'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { ReportDefinition } from '../ReportDefinition'
import { groupBy } from 'rxjs'

const ReportChart: React.FC<{ reportServiceUrl: string }> = ({ reportServiceUrl }) => {
  return (
    <ReportChart1
      reportService={new ReportServiceConnector(reportServiceUrl)}
      report={new ReportDefinition()}
    ></ReportChart1>
  )
}

export const ReportChart1: React.FC<{
  reportService: IReportService
  report: ReportDefinition
}> = ({ reportService, report }) => {
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
      <ReportBarChart
        data={data}
        xFields={report.groupBy || []}
        yGroups={report.reportValues || []}
        yFields={yValues}
        horizontal={report.horizontal}
      ></ReportBarChart>
    </div>
  )
}

const ReportBarChart: React.FC<{
  data: { [key: string]: any }[]
  xFields: string[]
  yGroups: string[]
  yFields: string[]
  horizontal: boolean
}> = ({ data, xFields, yGroups, yFields, horizontal }) => {
  function getCategory(d: any) {
    let result = ''
    xFields.forEach((xField: any, i: number) => {
      if (i > 0) {
        result += '_' + d[xField]
      } else {
        result += d[xField]
      }
    })
    return result
  }
  function getYGroup(yField: string) {
    for (let yGroup of yGroups) {
      if (yField.startsWith(yGroup)) {
        return yGroup
      }
    }
    return ''
  }
  var options2: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
    },
    stroke: {
      width: 1,
      colors: ['#fff'],
    },
    dataLabels: {
      formatter: (val: any) => {
        return val / 1000 + 'K'
      },
    },
    plotOptions: {
      bar: {
        horizontal: horizontal,
      },
    },
    xaxis: {
      categories: data.map((d) => getCategory(d)),
    },
    colors: ['#80c7fd', '#008FFB', '#80f1cb', '#00E396'],
    legend: {
      position: 'top',
      horizontalAlign: 'left',
    },
  }
  var series2 = yFields.map((yField) => {
    return {
      name: yField,
      group: getYGroup(yField),
      data: data.map((d) => d[yField]),
    }
  })

  return (
    <Chart
      options={options2}
      series={series2}
      type='bar'
      height={horizontal ? xFields.length * 1000 : 500}
      width={horizontal ? 1000 : xFields.length * 1000}
    ></Chart>
  )
}

export default ReportChart
