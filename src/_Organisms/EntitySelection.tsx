import React, { useState } from 'react'
import EntityTable from '../components/guifad/_Organisms/EntityTable'
import { IDataSourceManagerWidget, IDataSource } from 'ushell-modulebase'
import { LayoutDescriptionRoot } from '../[Move2LayoutDescription]/LayoutDescriptionRoot'

const EntitySelection: React.FC<{
  dataSourceManagerForNavigations?: IDataSourceManagerWidget
  dataSource: IDataSource
  layoutDescription?: LayoutDescriptionRoot
  className?: string
  classNameBgToolbar?: string
  rowHeight?: number
  reloadTriggerObject?: any
  onRecordSelected: (r: any) => void
}> = ({
  dataSourceManagerForNavigations,
  dataSource,
  className,
  layoutDescription,
  classNameBgToolbar,
  rowHeight = 1,
  reloadTriggerObject,
  onRecordSelected,
}) => {
  const [selectedRecord, setSelectedRecord] = useState<any>(null)

  function selectRecord(r?: any) {
    if (!r && !selectRecord) return
    onRecordSelected(r || selectedRecord)
  }

  function updateSelectedRecord(rs: any[]) {
    if (rs.length == 1) {
      setSelectedRecord(rs[0])
    } else {
      setSelectedRecord(null)
    }
  }
  return (
    <div className='flex flex-col w-full h-full overflow-hidden'>
      <EntityTable
        dataSourceManagerForNavigations={dataSourceManagerForNavigations}
        dataSource={dataSource}
        className={className}
        layoutDescription={layoutDescription}
        classNameBgToolbar={classNameBgToolbar}
        rowHeight={rowHeight}
        reloadTriggerObject={reloadTriggerObject}
        entitySchema={dataSource.entitySchema!}
        onRecordEnter={(r) => selectRecord(r)}
        onSelectedRecordsChange={(sr) => updateSelectedRecord(sr)}
        enableCrud={false}
        enableParentFilter={false}
      ></EntityTable>
      <div className='flex justify-end gap-2 p-1 px-4 rounded-sm '>
        <button
          className='rounded-sm p-2 hover:bg-contentHover dark:hover:bg-contentHoverDark cursor-pointer'
          onClick={() => onRecordSelected(null)}
        >
          Cancel
        </button>
        <button
          disabled={selectRecord == null}
          className={`rounded-sm p-2  cursor-pointer ${
            !selectedRecord
              ? 'text-gray-500'
              : 'hover:bg-contentHover dark:hover:bg-contentHoverDark'
          }`}
          onClick={() => selectRecord()}
        >
          Select
        </button>
      </div>
    </div>
  )
}

export default EntitySelection
