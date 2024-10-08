import React from 'react'
import { ReportDefinition } from '../ReportDefinition'
import ChevrodnDownIcon from '../../../_Icons/ChevrodnDownIcon'

const ReportManagerBreadcrumb: React.FC<{
  reportCollection: ReportDefinition[]
  report: ReportDefinition | null
  setReport: (r: ReportDefinition | null) => void
}> = ({ reportCollection, report, setReport }) => {
  return (
    <div className='UShell_ReportManager_Breadcrumb flex test-md gap-3 items-center text-lg'>
      <button
        className='hover:bg-contentHover dark:hover:bg-contentHoverDark rounded-sm p-2'
        onClick={() => setReport(null)}
      >
        Reports
      </button>
      {report && (
        <>
          <button>
            <ChevrodnDownIcon size={3} rotate={270}></ChevrodnDownIcon>
          </button>
          <button>{report.folder}</button>
          <button>
            <ChevrodnDownIcon size={3} rotate={270}></ChevrodnDownIcon>
          </button>
          <button className='hover:bg-contentHover dark:hover:bg-contentHoverDark rounded-sm p-2'>
            {report.name}
          </button>
        </>
      )}
    </div>
  )
}

export default ReportManagerBreadcrumb
