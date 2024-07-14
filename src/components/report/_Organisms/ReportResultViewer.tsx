import React, { useState } from 'react'
import { ReportDefinition } from '../ReportDefinition'
import { IReportService } from '../IReportService'
import ReportChart, { ReportChart1 } from '../_Molecules/ReportChart'
import ReportTable from '../_Molecules/ReportTable'
import { EntitySchema } from 'fusefx-modeldescription'

const ReportResultViewer: React.FC<{
  report: ReportDefinition
  reportService: IReportService
  entitySchema: EntitySchema
}> = ({ report, reportService, entitySchema }) => {
  const [tab, setTab] = useState<'table' | 'chart'>('table')
  return (
    <div className='h-full w-full flex flex-col'>
      <div className='toolbar flex border-b border-bg8 dark:border-bg8dark text-sm'>
        <div className='flex gap-4 border-bg8 dark:border-bg8dark px-2'>
          <button
            onClick={(e) => setTab('table')}
            className={`${tab == 'table' ? 'border-b-2 border-prim2' : ''}`}
          >
            <div className='p-2'>Table</div>
          </button>
          <button
            onClick={(e) => setTab('chart')}
            className={`p-2 ${tab == 'chart' ? 'border-b-2 border-prim2' : ''}`}
          >
            <div className=''>Chart</div>
          </button>
        </div>
      </div>
      <div className='h-full overflow-auto'>
        {tab == 'table' && (
          <ReportTable
            reportService={reportService}
            report={report}
            entitySchema={entitySchema}
          ></ReportTable>
        )}
        {tab == 'chart' && (
          <ReportChart1 reportService={reportService} report={report}></ReportChart1>
        )}
      </div>
    </div>
  )
}

export default ReportResultViewer
