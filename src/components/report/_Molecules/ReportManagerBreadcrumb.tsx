import React from 'react'
import { ReportDefinition } from '../ReportDefinition'
import ChevrodnDownIcon from '../../../_Icons/ChevrodnDownIcon'

const ReportManagerBreadcrumb: React.FC<{
  reportCollection: ReportDefinition[]
  report: ReportDefinition | null
  setReport: (r: ReportDefinition | null) => void
}> = ({ reportCollection, report, setReport }) => {
  return (
    <div className='flex test-md gap-1'>
      <button className='hover:underline' onClick={() => setReport(null)}>
        Reports
      </button>
      {report && (
        <>
          <button>
            <ChevrodnDownIcon size={5} rotate={270}></ChevrodnDownIcon>
          </button>
          <button>{report.folder}</button>
          <button>
            <ChevrodnDownIcon size={5} rotate={270}></ChevrodnDownIcon>
          </button>
          <button>{report.name}</button>
        </>
      )}
    </div>
  )
}

export default ReportManagerBreadcrumb
