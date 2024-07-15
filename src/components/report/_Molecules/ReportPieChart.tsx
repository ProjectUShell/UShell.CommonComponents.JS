import React from 'react'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

const ReportPieChart: React.FC<{
  data: { [key: string]: any }[]
  xFields: string[]
  yGroups: string[]
  yFields: string[]
  donut: boolean
}> = ({ data, xFields, yGroups, yFields, donut }) => {
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

  const colors = ['#abc7fd', '#008FFB', '#80f1cb', '#00E396']
  var options2: ApexOptions = {
    chart: {
      type: 'donut',
      height: 350,
    },
    // colors: colors,
    labels: data.map((d) => getCategory(d)),
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  }
  var series2 = yFields.length > 0 ? data.map((d) => d[yFields[0]]) : []

  return (
    <Chart
      options={options2}
      series={series2}
      type={donut ? 'donut' : 'pie'}
      height={500}
      width={500}
    ></Chart>
  )
}

export default ReportPieChart
