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

const ReportEditor: React.FC<{
  entitySchema: EntitySchema
  report: ReportDefinition
  setReport: (rd: ReportDefinition) => void
  saveReport: (rd: ReportDefinition) => void
  deleteReport: (rd: ReportDefinition) => void
}> = ({ entitySchema, report, setReport, saveReport, deleteReport }) => {
  const [tab, setTab] = useState<'query' | 'chart'>('chart')

  return (
    <>
      <div className='editor border-0  w-full h-full flex flex-col  '>
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
              <button onClick={() => saveReport(report)}>Save</button>
            </div>
            <div className=' ml-2 p-2 hover:bg-bg6 dark:hover:bg-bg5dark'>
              <button
                className='text-red-500 dark:text-red-300'
                onClick={() => deleteReport(report)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        <div className='h-full overflow-auto'>
          {tab == 'query' && (
            <LogicalExpressionTree
              dataSourceManager={new FuseDataStore('fuseUrl', 'body')}
              expression={
                report.filter || {
                  matchAll: true,
                  negate: false,
                  subTree: [],
                  predicates: [{ fieldName: '', operator: '', value: '' }],
                }
              }
              fields={entitySchema.fields}
              fkRelations={[]}
              onUpdateExpression={(e) => {
                setReport({ ...report, filter: e })
              }}
            ></LogicalExpressionTree>
          )}
          {tab == 'chart' && (
            <ReportChartEditor
              entitySchema={entitySchema}
              reportChartDefinition={report}
              onUpdateDefinition={(d) => {
                setReport({ ...report, ...d })
              }}
            ></ReportChartEditor>
          )}
        </div>
      </div>
    </>
  )
}

export default ReportEditor
