import React, { useState } from 'react'
import { IReportRepository } from '../IReportRepository'
import { ReportDefinition } from '../ReportDefinition'
import TreeView, { TreeView1 } from '../../../_Molecules/TreeView'

const ReportExplorer: React.FC<{
  reportCollection: ReportDefinition[]
  enterReport: (report: ReportDefinition) => void
  createNewReport: () => void
}> = ({ reportCollection, enterReport, createNewReport }) => {
  const [tab, setTab] = useState<'all' | 'favorites'>('all')
  return (
    <div className='editor border-0  w-full h-full flex flex-col  '>
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
        <div className='flex gap-4 py-1 ml-2 my-2 border-l-2'>
          <div className=' ml-2 p-2 hover:bg-bg6 dark:hover:bg-bg5dark'>
            <button onClick={() => createNewReport()}>New Query</button>
          </div>
          <div className=' ml-2 p-2 hover:bg-bg6 dark:hover:bg-bg5dark'>
            <button>New Folder</button>
          </div>
        </div>
      </div>
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
  )
}

export default ReportExplorer
