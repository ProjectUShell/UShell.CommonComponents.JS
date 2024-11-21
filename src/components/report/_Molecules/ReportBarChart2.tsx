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
import { getStackGroups, mergeGroupBysToSingleField } from '../ReportUtils'

const ReportBarChart2: React.FC<{
  data: { [key: string]: any }[]
  groupBy: string[]
  stackBy: string[]
  reportValues: string[]
  horizontal: boolean
  dark: boolean
  xAxis?: boolean
  yAxis?: boolean
}> = ({ data, groupBy, stackBy, reportValues, horizontal, dark, xAxis = true, yAxis = true }) => {
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
            {xAxis && (
              <XAxis
                dataKey={singleFieldName}
                stroke={dark ? 'rgb(220,220,220)' : 'rgb(20,20,20'}
              />
            )}
            {yAxis && <YAxis stroke={dark ? 'rgb(220,220,220)' : 'rgb(20,20,20'} />}
          </>
        )}
        {!horizontal && (
          <>
            {xAxis && <XAxis type='number' stroke={dark ? 'rgb(220,220,220)' : 'rgb(20,20,20'} />}
            {yAxis && (
              <YAxis
                type='category'
                dataKey={singleFieldName}
                stroke={dark ? 'rgb(220,220,220)' : 'rgb(20,20,20'}
              />
            )}
          </>
        )}
        <Tooltip contentStyle={{ background: dark ? 'rgb(20,20,20)' : 'white' }} />
        <Legend />
        {Object.keys(stackGroups).map((stackId) =>
          stackGroups[stackId].map((sg, i) => (
            <Bar
              layout={horizontal ? 'horizontal' : 'vertical'}
              dataKey={sg}
              stackId={stackId}
              fill={getReportColor(i, dark)}
            />
          )),
        )}
      </BarChart>
    </ResponsiveContainer>
  )
}

export default ReportBarChart2
