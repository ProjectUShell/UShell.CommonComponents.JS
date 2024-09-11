import React, { useMemo } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Pie,
  PieChart,
  Cell,
} from 'recharts'
import { getReportColor } from '../ReportColors'
import { getStackGroups, mergeGroupBysToSingleField } from '../ReportUtils'

const ReportPieChart2: React.FC<{
  data: { [key: string]: any }[]
  groupBy: string[]
  stackBy: string[]
  reportValues: string[]
  dark: boolean
}> = ({ data, groupBy, stackBy, reportValues, dark }) => {
  console.log('barchart2', {
    groupBy: groupBy,
    stackBy: stackBy,
    reportValues: reportValues,
    data: data,
  })

  const singleFieldName = useMemo(() => {
    return 'name'
    let res: string = ''
    for (let i = 0; i < groupBy.length; ++i) {
      res += groupBy[i]
      if (i < groupBy.length - 1) {
        res += '_'
      }
    }
    return res
  }, [groupBy])

  const data3 = mergeGroupBysToSingleField(data, groupBy, singleFieldName)
  console.log('dark?', dark)
  return (
    <ResponsiveContainer width='100%' height='100%'>
      <PieChart width={400} height={400}>
        <Pie
          dataKey={reportValues[0]}
          isAnimationActive={false}
          data={data3}
          cx='50%'
          cy='50%'
          outerRadius='80%'
          fill='#8884d8'
          label
        >
          {data3.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getReportColor(index, dark)} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default ReportPieChart2
