import React, { useState } from 'react'
import { IReportRepository } from '../IReportRepository'
import { ReportDefinition } from '../ReportDefinition'
import TreeView, { TreeView1 } from '../../../_Molecules/TreeView'
import PlusCircleIcon from '../../../_Icons/PlusCircleIcon'

const ReportExplorer: React.FC<{
  reportCollection: ReportDefinition[]
  enterReport: (report: ReportDefinition) => void
  createNewReport: () => void
}> = ({ reportCollection, enterReport, createNewReport }) => {
  const [tab, setTab] = useState<'all' | 'favorites'>('all')
  return (
    <div className='UShell_ReportExplorer border-0 border-red-400  w-full h-full flex flex-col  '>
      <div className='toolbar flex border-b border-bg8 dark:border-bg8dark text-sm'>
        <div className='flex gap-4 border-bg8 dark:border-bg8dark px-2'>
          <button
            onClick={(e) => setTab('all')}
            className={`${tab == 'all' ? 'border-b-2 border-prim2' : ''}`}
          >
            <div className='p-2'>All</div>
          </button>
          <button
            onClick={(e) => setTab('favorites')}
            className={`p-2 ${tab == 'favorites' ? 'border-b-2 border-prim2' : ''}`}
          >
            <div className=''>Favorites</div>
          </button>
        </div>
        <div className='flex gap-4 py-1 ml-2 my-2 border-l'>
          <div className=' ml-2 p-2 hover:bg-contentHover dark:hover:bg-contentHoverDark'>
            <button onClick={() => createNewReport()}>
              <p>+ New Query</p>
            </button>
          </div>
          <div className=' ml-2 p-2 hover:bg-bg6 dark:hover:bg-bg5dark'>
            <button>New Folder</button>
          </div>
        </div>
      </div>
      <div className='m-2 bg-navigation dark:bg-navigationDark rounded-md'>
        <TreeView1
          data={reportCollection}
          pathField='folder'
          keyField='name'
          renderColumn={(d: any, c: string) => (
            <div className='hover:underline cursor-pointer' onClick={() => enterReport(d)}>
              {d.name}
            </div>
          )}
        ></TreeView1>
      </div>
    </div>
  )
}

export default ReportExplorer
