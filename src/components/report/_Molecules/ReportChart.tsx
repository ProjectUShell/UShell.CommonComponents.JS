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
    <ReportChart2
      data={data}
      xField={report.groupBy && report.groupBy.length > 0 ? report.groupBy[0] : ''}
      yFields={yValues}
      stacked={false}
    ></ReportChart2>
  )
}

const ReportChart2: React.FC<{
  data: { [key: string]: any }[]
  xField: string
  yFields: string[]
  stacked: boolean
}> = ({ data, xField, yFields, stacked }) => {
  const optionsTest2: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: stacked,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        borderRadiusApplication: 'end', // 'around', 'end'
        borderRadiusWhenStacked: 'last', // 'all', 'last'
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: '13px',
              fontWeight: 900,
            },
          },
        },
      },
    },
    xaxis: {
      type: 'category',
      categories: data.map((d) => d[xField]),
    },
    legend: {
      position: 'right',
      offsetY: 40,
    },
    fill: {
      opacity: 1,
    },
  }
  const optionsTest = {
    series: yFields.map((yField) => {
      return {
        name: yField,
        data: data.map((d) => d[yField]),
      }
    }),
  }

  if (!xField || xField == '') {
    return <div>No Data</div>
  }

  // return <div>Test</div>
  return (
    <div className='h-full w-full flex flex-col overflow-auto border-4 border-red-400'>
      <Chart options={optionsTest2} series={optionsTest.series} type='bar' height={350}></Chart>
    </div>
  )
}

export default ReportChart
