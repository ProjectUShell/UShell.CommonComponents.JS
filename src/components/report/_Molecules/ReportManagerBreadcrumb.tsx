import React from 'react'
import { ReportDefinition } from '../ReportDefinition'

const ReportManagerBreadcrumb: React.FC<{
  reportCollection: ReportDefinition[]
  report: ReportDefinition | null
}> = ({ reportCollection, report }) => {
  return (
    <div className='flex'>
      <button>Reports</button>
      {report && (
        <>
          <button>\</button>
          <button>{report.folder}</button>
          <button>\</button>
          <button>{report.name}</button>
        </>
      )}
    </div>
  )
}

export default ReportManagerBreadcrumb
