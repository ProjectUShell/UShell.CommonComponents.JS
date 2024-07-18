import React from 'react'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

const ReportBarChart: React.FC<{
  data: { [key: string]: any }[]
  xFields: string[]
  yGroups: string[]
  yFields: string[]
  horizontal: boolean
  dark: boolean
}> = ({ data, xFields, yGroups, yFields, horizontal, dark }) => {
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
      background: dark ? 'rgb(57, 56, 61)' : undefined,
    },
    stroke: {
      width: 1,
      // colors: ['#fff'],
    },
    dataLabels: {},
    plotOptions: {
      bar: {
        horizontal: horizontal,
      },
    },
    xaxis: {
      categories: data.map((d) => getCategory(d)),
    },
    // colors: ['#80c7fd', '#008FFB', '#80f1cb', '#00E396'],
    legend: {
      position: 'top',
      horizontalAlign: 'left',
    },
    theme: {
      mode: dark ? 'dark' : 'light',
      monochrome: {},
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

export default ReportBarChart
