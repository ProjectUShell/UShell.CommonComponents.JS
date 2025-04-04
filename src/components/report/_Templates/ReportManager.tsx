import React, { useEffect, useMemo, useState } from 'react'
import { ReportDefinition } from '../ReportDefinition'
import ReportManagerBreadcrumb from '../_Molecules/ReportManagerBreadcrumb'
import { LogicalExpression } from 'fusefx-repositorycontract'
import ReportEditor from '../_Organisms/ReportEditor'
import { IReportService } from '../IReportService'
import { EntitySchema } from 'fusefx-modeldescription'
import ReportResultViewer from '../_Organisms/ReportResultViewer'
import { IReportRepository } from '../IReportRepository'
import ReportExplorer from '../_Organisms/ReportExplorer'
import {
  QueryClient,
  QueryClientContext,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import PencilAlt from '../../../_Icons/PencilAlt'
import PresentationChartBar from '../../../_Icons/PresentationChartBarIcon'
import MenuAlt4 from '../../../_Icons/MenuAlt4'

export const ReportManager1: React.FC<{
  reportRepository: IReportRepository
  reportSerivce: IReportService
  dark: boolean
  initialReport?: ReportDefinition
}> = ({ reportRepository, reportSerivce, dark, initialReport }) => {
  const qcc: any = QueryClientContext
  if (!qcc._currentValue) {
    return (
      <QueryClientProvider client={new QueryClient()}>
        <ReportManager1Inner
          reportRepository={reportRepository}
          reportSerivce={reportSerivce}
          dark={dark}
          initialReport={initialReport}
        ></ReportManager1Inner>
      </QueryClientProvider>
    )
  }
  return (
    <ReportManager1Inner
      reportRepository={reportRepository}
      reportSerivce={reportSerivce}
      dark={dark}
      initialReport={initialReport}
    ></ReportManager1Inner>
  )
}

export const ReportManager1Inner: React.FC<{
  reportRepository: IReportRepository
  reportSerivce: IReportService
  dark: boolean
  initialReport?: ReportDefinition
}> = ({ reportRepository, reportSerivce, dark, initialReport }) => {
  const [r, setR] = useState(0)
  const { isLoading, error, data } = useQuery({
    queryKey: ['reportRepository', reportRepository, r],
    queryFn: () => {
      try {
        return reportRepository.getReports()
      } catch (error) {
        return null
      }
    },
  })

  if (isLoading) {
    return <div>Loading</div>
  }

  if (!data) {
    return <div>Loading</div>
  }

  return (
    <ReportManager
      reportCollection={data}
      reportSerivce={reportSerivce}
      addOrUpdateReport={(r: ReportDefinition) => {
        reportRepository.addOrUpdateReport(r)
        setR((x) => x + 1)
      }}
      deleteReport={(r) => {
        reportRepository.deleteReport(r)
        setR((x) => x + 1)
      }}
      canSaveReport={(r) => reportRepository.canSaveReport(r)}
      dark={dark}
      initialReport={initialReport}
    ></ReportManager>
  )
}

export const ReportManager: React.FC<{
  reportCollection: ReportDefinition[]
  addOrUpdateReport: (r: ReportDefinition) => void
  deleteReport: (r: ReportDefinition) => void
  canSaveReport: (r: ReportDefinition) => { success: boolean; reason: string }
  reportSerivce: IReportService
  dark: boolean
  reportName?: string
  initialReport?: ReportDefinition
}> = ({
  reportCollection,
  addOrUpdateReport,
  deleteReport,
  canSaveReport,
  reportSerivce,
  reportName,
  dark,
  initialReport,
}) => {
  const [currentReport, setCurrentReport] = useState<ReportDefinition | null>(null)
  const [entitySchema, setEntitySchema] = useState<EntitySchema | null>(null)
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'result'>('split')

  useEffect(() => {
    if (!initialReport) return
    setCurrentReport(initialReport)
  }, [initialReport])

  useEffect(() => {
    reportSerivce.getEntitySchema().then((es: EntitySchema) => setEntitySchema(es))
  }, [reportSerivce])

  useEffect(() => {
    if (!reportName || reportName == '') {
      return
    }
    for (let report of reportCollection) {
      if (report.name == reportName) {
        console.log('setCurrentReport', report)
        setCurrentReport(report)
        return
      }
    }
    console.log('setCurrentReport')
    setCurrentReport({
      name: reportName,
      folder: 'My Reports',
      reportValues: [],
      type: 'Table',
      horizontal: false,
      multiAxis: false,
      stacked: false,
      limit: 20,
      sortedBy: '',
    })
  }, [reportName])

  if (!entitySchema) return <div>Loading...</div>
  return (
    <div className='UShell_ReportManager w-full h-full flex flex-col px-2 border-0 border-red-400'>
      <div className='UShell_ReportManager_TopBar flex justify-between border-0 border-red-400 w-full mb-4 mt-2'>
        <ReportManagerBreadcrumb
          reportCollection={reportCollection}
          report={currentReport}
          setReport={setCurrentReport}
        ></ReportManagerBreadcrumb>
        <div className='flex gap-1'>
          <button
            className='hover:bg-bg4 dark:hover:bg-bg6dark p-1'
            onClick={() => setViewMode('split')}
          >
            <MenuAlt4></MenuAlt4>
          </button>
          <button
            className='hover:bg-bg4 dark:hover:bg-bg6dark p-1'
            onClick={() => setViewMode('editor')}
          >
            <PencilAlt></PencilAlt>
          </button>
          <button
            className='hover:bg-bg4 dark:hover:bg-bg6dark p-1'
            onClick={() => setViewMode('result')}
          >
            <PresentationChartBar></PresentationChartBar>
          </button>
        </div>
      </div>
      {!currentReport && (
        <ReportExplorer
          reportCollection={reportCollection}
          enterReport={(r) => setCurrentReport(r)}
          createNewReport={() =>
            setCurrentReport({
              folder: 'My',
              name: 'New Report',
              type: 'Bar',
              horizontal: false,
              multiAxis: false,
              stacked: false,
              limit: 20,
              sortedBy: '',              
            })
          }
        ></ReportExplorer>
      )}
      <div className='h-full w-full max-h-full overflow-hidden border-0 border-pink-400'>
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
              saveReport={(r) => {
                addOrUpdateReport(r)
              }}
              deleteReport={(r) => {
                deleteReport(r)
                setCurrentReport(null)
              }}
              canSave={canSaveReport}
            ></ReportEditor>
          )}
        </div>
        {currentReport && (
          <div
            className={`result w-full flex flex-col border-0 border-blue-400 ${
              viewMode == 'split' ? 'h-1/2' : viewMode == 'result' ? 'h-full' : 'h-0'
            }`}
          >
            <ReportResultViewer
              report={currentReport}
              reportService={reportSerivce}
              entitySchema={entitySchema}
              dark={dark}
            ></ReportResultViewer>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportManager
