import React from 'react'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

const ReportAreaChart: React.FC<{
  data: { [key: string]: any }[]
  xFields: string[]
  yGroups: string[]
  yFields: string[]
  stacked: boolean
}> = ({ data, xFields, yGroups, yFields, stacked }) => {
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

  function getMinY(yField: string) {
    return 0
    return Math.min(...data.map((d) => d[yField]))
  }
  function getMaxY(yField: string) {
    return Math.max(...data.map((d) => d[yField])) * 1.1
  }

  const colors = ['#abc7fd', '#008FFB', '#80f1cb', '#00E396']
  var options2: ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
      stacked: stacked,
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: 'smooth',
    },
    plotOptions: {
      bar: {},
    },
    // colors: colors,
    xaxis: {
      categories: data.map((d) => getCategory(d)),
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
    },
  }
  var series2 = yFields.map((yField) => {
    return {
      name: yField,
      data: data.map((d) => d[yField]),
    }
  })

  return (
    <Chart
      options={options2}
      series={series2}
      type='area'
      height={500}
      width={xFields.length * 800}
    ></Chart>
  )
}

export default ReportAreaChart
