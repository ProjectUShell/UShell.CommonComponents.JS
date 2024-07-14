import React, { useEffect, useMemo, useState } from 'react'
import { ReportDefinition } from '../ReportDefinition'
import ReportManagerBreadcrumb from '../_Molecules/ReportManagerBreadcrumb'
import { LogicalExpression } from 'fusefx-repositorycontract'
import ReportEditor from '../_Organisms/ReportEditor'
import { IReportService } from '../IReportService'
import { EntitySchema } from 'fusefx-modeldescription'
import ReportResultViewer from '../_Organisms/ReportResultViewer'

const ReportManager: React.FC<{
  reportCollection: ReportDefinition[]
  reportSerivce: IReportService
  reportName?: string
}> = ({ reportCollection, reportSerivce, reportName }) => {
  const [currentReport, setCurrentReport] = useState<ReportDefinition | null>(null)
  const [entitySchema, setEntitySchema] = useState<EntitySchema | null>(null)
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'result'>('split')

  useEffect(() => {
    reportSerivce.getEntitySchema().then((es: EntitySchema) => setEntitySchema(es))
  }, [reportSerivce])

  useEffect(() => {
    if (!reportName || reportName == '') {
      return
    }
    for (let report of reportCollection) {
      if (report.name == reportName) {
        setCurrentReport(report)
        return
      }
    }
    setCurrentReport({
      name: reportName,
      folder: 'My Reports',
      reportValues: [],
      type: 'Table',
    })
  }, [reportName])

  if (!entitySchema) return <div>Loading...</div>

  return (
    <div className='w-full h-full flex flex-col mx-1'>
      <div className='breadcrumb flex justify-between border-0 border-red-400 w-full mb-4 mt-2'>
        <ReportManagerBreadcrumb
          reportCollection={reportCollection}
          report={currentReport}
        ></ReportManagerBreadcrumb>
        <div className='flex gap-1'>
          <button onClick={() => setViewMode('split')}>Split</button>
          <button onClick={() => setViewMode('editor')}>Editor</button>
          <button onClick={() => setViewMode('result')}>Result</button>
        </div>
      </div>
      <div
        className={`editor border-0  w-full flex flex-col transition-all ${
          viewMode == 'split' ? 'h-1/2' : viewMode == 'editor' ? 'h-full' : 'h-0 invisible'
        }`}
      >
        {currentReport && (
          <ReportEditor
            entitySchema={entitySchema}
            report={currentReport}
            setReport={(r) => setCurrentReport({ ...r })}
          ></ReportEditor>
        )}
      </div>
      {currentReport && (
        <div
          className={`result border-0  w-full flex flex-col ${
            viewMode == 'split' ? 'h-1/2' : viewMode == 'result' ? 'h-full' : 'h-0'
          }`}
        >
          <ReportResultViewer
            report={currentReport}
            reportService={reportSerivce}
            entitySchema={entitySchema}
          ></ReportResultViewer>
        </div>
      )}
    </div>
  )
}

export default ReportManager
