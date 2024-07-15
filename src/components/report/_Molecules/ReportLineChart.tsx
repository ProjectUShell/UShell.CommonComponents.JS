import React from 'react'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

const ReportLineChart: React.FC<{
  data: { [key: string]: any }[]
  xFields: string[]
  yGroups: string[]
  yFields: string[]
  multiAxis: boolean
}> = ({ data, xFields, yGroups, yFields, multiAxis }) => {
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

  // const colors = ['#80c7fd', '#008FFB', '#80f1cb', '#00E396']
  var options2: ApexOptions = {
    chart: {
      type: 'line',
      height: 350,
      stacked: false,
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
    yaxis: multiAxis
      ? yFields.map((y, i) => {
          return {
            title: { text: y },
            min: getMinY(y),
            max: getMaxY(y),
            axisTicks: { show: true },
            axisBorder: { show: true },
          }
        })
      : {
          title: { text: 'y' },
          min: 0,
          max: 1000,
          axisTicks: { show: true },
          axisBorder: { show: true },
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
      type='line'
      height={500}
      width={xFields.length * 800 * (multiAxis ? 2 : 1)}
    ></Chart>
  )
}

export default ReportLineChart
