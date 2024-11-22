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
} from 'recharts'
import { getReportColor } from '../ReportColors'
import { getStackGroups, getTimeSpanString, mergeGroupBysToSingleField } from '../ReportUtils'

const ReportBarChart2: React.FC<{
  data: { [key: string]: any }[]
  groupBy: string[]
  stackBy: string[]
  reportValues: string[]
  horizontal: boolean
  dark: boolean
  xAxis?: boolean
  yAxis?: boolean
  prefixToRemove?: string
}> = ({
  data,
  groupBy,
  stackBy,
  reportValues,
  horizontal,
  dark,
  xAxis = true,
  yAxis = true,
  prefixToRemove,
}) => {
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
      <BarChart
        barCategoryGap={4}
        layout={horizontal ? 'horizontal' : 'vertical'}
        // layout='vertical'
        style={{}}
        width={500}
        height={300}
        data={data3}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        {horizontal && (
          <>
            <XAxis
              dataKey={singleFieldName}
              stroke={dark ? 'rgb(220,220,220)' : 'rgb(20,20,20'}
              hide={!xAxis}
              tickFormatter={(v, i) => {
                if (!prefixToRemove) return v
                return (v as string).replace(prefixToRemove, '')
              }}
            />

            <YAxis
              tickFormatter={(v, i) => {
                const correspondingValue: string = reportValues[0]
                if (correspondingValue.toLocaleLowerCase().includes('duration')) {
                  return getTimeSpanString(v)
                }
                return v
              }}
              stroke={dark ? 'rgb(220,220,220)' : 'rgb(20,20,20'}
              hide={!yAxis}
            />
          </>
        )}
        {!horizontal && (
          <>
            <XAxis
              tickFormatter={(v, i) => {
                const correspondingValue: string = reportValues[0]
                if (correspondingValue.toLocaleLowerCase().includes('duration')) {
                  return getTimeSpanString(v)
                }
                return 'test'
              }}
              type='number'
              stroke={dark ? 'rgb(220,220,220)' : 'rgb(20,20,20'}
              hide={!xAxis}
            />

            <YAxis
              type='category'
              dataKey={singleFieldName}
              stroke={dark ? 'rgb(220,220,220)' : 'rgb(20,20,20'}
              hide={!yAxis}
              tickFormatter={(v, i) => {
                if (!prefixToRemove) return v
                return (v as string).replace(prefixToRemove, '')
              }}
            />
          </>
        )}
        <Tooltip
          labelFormatter={(v, i) => {
            if (!prefixToRemove) return v
            return (v as string).replace(prefixToRemove, '')
          }}
          formatter={(value, name, item, index, payload) => {
            // return name
            if (!(name as string).toLocaleLowerCase().includes('duration')) {
              return value
            }
            return getTimeSpanString(value as number)
          }}
          contentStyle={{ background: dark ? 'rgb(20,20,20)' : 'white' }}
        />
        <Legend />
        {Object.keys(stackGroups).map((stackId, j) =>
          stackGroups[stackId].map((sg, i) => (
            <Bar
              legendType='circle'
              layout={horizontal ? 'horizontal' : 'vertical'}
              dataKey={sg}
              stackId={stackId}
              fill={getReportColor(j + i, dark)}
            />
          )),
        )}
      </BarChart>
    </ResponsiveContainer>
  )
}

export default ReportBarChart2
