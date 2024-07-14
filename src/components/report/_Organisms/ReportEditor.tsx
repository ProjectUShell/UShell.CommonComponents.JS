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
}> = ({ entitySchema, report, setReport }) => {
  const [tab, setTab] = useState<'query' | 'chart'>('query')

  return (
    <>
      <div className='editor border-0  w-full h-full flex flex-col  '>
        <div className='toolbar flex border-b border-bg8 dark:border-bg8dark text-sm'>
          <div className='flex gap-4 border-bg8 dark:border-bg8dark px-2'>
            <button
              onClick={(e) => setTab('query')}
              className={`${tab == 'query' ? 'border-b-2 border-prim2' : ''}`}
            >
              <div className='p-2'>Query</div>
            </button>
            <button
              onClick={(e) => setTab('chart')}
              className={`p-2 ${tab == 'chart' ? 'border-b-2 border-prim2' : ''}`}
            >
              <div className=''>Chart</div>
            </button>
          </div>
          <div className='flex gap-4 py-2 ml-2 '>
            <div className='border-l-2 px-4'>
              <button>Save</button>
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
