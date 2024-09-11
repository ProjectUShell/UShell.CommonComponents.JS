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
  Area,
  AreaChart,
} from 'recharts'
import { getReportColor } from '../ReportColors'
import { getStackGroups, mergeGroupBysToSingleField } from '../ReportUtils'

const ReportAreaChart2: React.FC<{
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

  const stackGroups: { [stackId: string]: string[] } = getStackGroups(
    data,
    groupBy,
    stackBy,
    reportValues,
  )

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey={singleFieldName} />
        <YAxis />
        <Tooltip />
        {Object.keys(stackGroups).map((stackId) =>
          stackGroups[stackId].map((sg, i) => (
            <Area
              type='monotone'
              dataKey={sg}
              stackId={stackId}
              stroke={getReportColor(i, dark)}
              fill={getReportColor(i, dark)}
            />
          )),
        )}
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default ReportAreaChart2
