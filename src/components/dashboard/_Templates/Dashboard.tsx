import React from 'react'
import { DashboardData } from '../DashboardData'

const Dashboard: React.FC<{ data: DashboardData }> = ({ data }) => {
  return (
    <div className='flex flex-col'>
      <h1>{data.title}</h1>
      <div className='grid grid-flow-row-dense grid-cols-3 grid-rows-3 gap-4'>
        {data.entires.map((e) => (
          <div className='rounded-md bg-red-400 p-1'>
            {e.render ? e.render() : <div>{e.title}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
