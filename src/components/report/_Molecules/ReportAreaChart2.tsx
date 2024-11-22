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
import { getStackGroups, getTimeSpanString, mergeGroupBysToSingleField } from '../ReportUtils'

const ReportAreaChart2: React.FC<{
  data: { [key: string]: any }[]
  groupBy: string[]
  stackBy: string[]
  reportValues: string[]
  dark: boolean
  legend: boolean
  prefixToRemove?: string
}> = ({ data, groupBy, stackBy, reportValues, dark, legend, prefixToRemove }) => {
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
          left: 10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis
          dataKey={singleFieldName}
          stroke={dark ? 'rgb(220,220,220)' : 'rgb(20,20,20'}
          tickFormatter={(v, i) => {
            if (!prefixToRemove) return v
            return (v as string).replace(prefixToRemove, '')
          }}
        />
        <YAxis
          padding={{ top: 10 }}
          width={100}
          tickFormatter={(v, i) => {
            const correspondingValue: string = reportValues[0]
            if (correspondingValue.toLocaleLowerCase().includes('duration')) {
              return getTimeSpanString(v)
            }
            return v
          }}
          stroke={dark ? 'rgb(220,220,220)' : 'rgb(20,20,20'}
        />
        <Tooltip
          labelFormatter={(v, i) => {
            if (!prefixToRemove) return v
            return (v as string).replace(prefixToRemove, '')
          }}
          formatter={(value, name, item, index, payload) => {
            if (!reportValues[0].toLocaleLowerCase().includes('duration')) {
              return value
            }
            return getTimeSpanString(value as number)
          }}
          contentStyle={{ background: dark ? 'rgb(20,20,20)' : 'white' }}
        />
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
        {legend && <Legend />}
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default ReportAreaChart2
