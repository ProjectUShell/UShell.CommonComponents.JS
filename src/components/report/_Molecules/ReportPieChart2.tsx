import React, { useMemo } from 'react'
import { ResponsiveContainer, Tooltip, Legend, Pie, PieChart, Cell } from 'recharts'
import { getReportColor } from '../ReportColors'
import { getTimeSpanString, mergeGroupBysToSingleField } from '../ReportUtils'

const ReportPieChart2: React.FC<{
  data: { [key: string]: any }[]
  groupBy: string[]
  stackBy: string[]
  reportValues: string[]
  dark: boolean
  donut: boolean
  legend: boolean
}> = ({ data, groupBy, stackBy, reportValues, dark, donut, legend }) => {
  console.log('barchart2', {
    groupBy: groupBy,
    stackBy: stackBy,
    reportValues: reportValues,
    data: data,
  })

  const singleFieldName = useMemo(() => {
    return 'name'
  }, [groupBy])

  const data3 = mergeGroupBysToSingleField(data, groupBy, singleFieldName)

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        style={{ color: 'black' }}
        className={dark ? 'text-black' : 'text-black'}
        x={x}
        y={y}
        fill={dark ? 'black' : 'white'}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline='central'
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }
  const isDuration: boolean = reportValues[0].toLocaleLowerCase().includes('duration')
  return (
    <ResponsiveContainer width='100%' height='100%'>
      <PieChart width={400} height={400}>
        <Pie
          dataKey={reportValues[0]}
          isAnimationActive={false}
          data={data3}
          cx='50%'
          cy='50%'
          innerRadius={donut ? '40%' : undefined}
          outerRadius='80%'
          fill='#8884d8'
          labelLine={isDuration ? false : true}
          label={isDuration ? renderCustomizedLabel : true}
        >
          {data3.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getReportColor(index, dark)} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, item, index, payload) => {
            if (!reportValues[0].toLocaleLowerCase().includes('duration')) {
              return value
            }
            return getTimeSpanString(value as number)
          }}
        />
        {legend && <Legend />}
      </PieChart>
    </ResponsiveContainer>
  )
}

export default ReportPieChart2
