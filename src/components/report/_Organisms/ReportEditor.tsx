import React, { useState } from 'react'
import TabControl from '../../../_Organisms/TabControl'
import LogicalExpressionEditor from '../../guifad/_Molecules/LogicalExpressionEditor'
import LogicalExpressionTree from '../../guifad/_Molecules/LogicalExpressionTree'
import { LocalStoreDataSource } from '../../../index_old'
import { FuseDataStore } from '../../../data/FuseDataStore'
import { LogicalExpression } from 'fusefx-repositorycontract'
import { IReportService } from '../IReportService'
import { EntitySchema } from 'fusefx-modeldescription'
import { ReportDefinition } from '../ReportDefinition'
import ReportChartEditor from '../_Molecules/ReportChartEditor'
import Tooltip from '../../../_Atoms/Tooltip'

const ReportEditor: React.FC<{
  entitySchema: EntitySchema
  report: ReportDefinition
  setReport: (rd: ReportDefinition) => void
  saveReport: (rd: ReportDefinition) => void
  deleteReport: (rd: ReportDefinition) => void
  canSave: (rd: ReportDefinition) => { success: boolean; reason: string }
}> = ({ entitySchema, report, setReport, saveReport, deleteReport, canSave }) => {
  const [tab, setTab] = useState<'query' | 'chart'>('chart')

  const canSaveRes: { success: boolean; reason: string } = canSave(report)

  return (
    <div className='UShell_ReportEditor border-0 border-red-400  w-full h-full flex flex-col  '>
      <div className='toolbar flex border-b border-bg8 dark:border-bg8dark text-sm'>
        <div className='flex gap-4 border-bg8 dark:border-bg8dark px-2'>
          <button
            onClick={(e) => setTab('chart')}
            className={`p-2 ${tab == 'chart' ? 'border-b-2 border-prim2' : ''}`}
          >
            <div className=''>Chart</div>
          </button>
          <button
            onClick={(e) => setTab('query')}
            className={`${tab == 'query' ? 'border-b-2 border-prim2' : ''}`}
          >
            <div className='p-2'>Query</div>
          </button>
        </div>
        <div className='flex gap-4 py-1 ml-2 my-2 border-l-2'>
          <div className=' ml-2 p-2 hover:bg-bg6 dark:hover:bg-bg5dark'>
            <button
              id={`ReportSaveButton_${report.name}`}
              className='disabled:text-red-400'
              disabled={!canSaveRes.success}
              onClick={() => saveReport(report)}
            >
              {!canSaveRes.success && (
                <Tooltip targetId={`ReportSaveButton_${report.name}`}>{canSaveRes.reason}</Tooltip>
              )}
              Save
            </button>
          </div>
          <div className=' ml-2 p-2 hover:bg-bg6 dark:hover:bg-bg5dark'>
            <button className='text-red-500 dark:text-red-300' onClick={() => deleteReport(report)}>
              Delete
            </button>
          </div>
        </div>
      </div>
      <div className='h-full overflow-auto'>
        {tab == 'query' && (
          <div
            className='bg-navigation dark:bg-navigationDark p-1 m-2 rounded-sm
              shadow-md shadow-bg8 dark:shadow-bg8dark'
          >
            <LogicalExpressionTree
              dataSourceManagerForNavigations={new FuseDataStore('fuseUrl', 'body')}
              expression={
                report.filter || {
                  matchAll: true,
                  negate: false,
                  subTree: [],
                  predicates: [{ fieldName: '', operator: '', valueSerialized: '' }],
                }
              }
              fields={entitySchema.fields}
              fkRelations={[]}
              onUpdateExpression={(e) => {
                setReport({ ...report, filter: e })
              }}
              classNameBgInput='bg-content dark:bg-contentDark'
              classNameBgInputHover='bg-bg2'
              classNameBgInputHoverDark='bg-bg2dark'
            ></LogicalExpressionTree>
          </div>
        )}
        {tab == 'chart' && (
          <div className='p-2 h-full'>
            <div
              className='bg-navigation dark:bg-navigationDark p-1 m-0 rounded-sm
             shadow-md shadow-bg8 dark:shadow-bg8dark h-full'
            >
              <ReportChartEditor
                entitySchema={entitySchema}
                reportChartDefinition={report}
                onUpdateDefinition={(d) => {
                  setReport({ ...report, ...d })
                }}
              ></ReportChartEditor>{' '}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportEditor
