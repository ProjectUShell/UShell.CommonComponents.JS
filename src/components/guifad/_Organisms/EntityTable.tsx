import React, { useEffect, useState } from 'react'
import { IDataSource } from 'ushell-modulebase'
import Table, { PagingParams, TableColumn } from './Table.tsx'
import PlusCircleIcon from '../../../_Icons/PlusCircleIcon'
import TrashIcon from '../../../_Icons/TrashIcon'

const EntityTable: React.FC<{
  dataSource: IDataSource
  className?: string
  onRecordEnter: (r: any) => void
  onSelectedRecordsChange: (selectedRecords: any[]) => void
  selectedRecord: any | null
  onCreateRecord: () => void
}> = ({ dataSource, className, onRecordEnter, onSelectedRecordsChange, selectedRecord, onCreateRecord }) => {
  const [records, setRecords] = useState<any[]>([])
  const [selectedRecords, setSelectedRecords] = useState<any[]>([])
  const [columns, setColumns] = useState<TableColumn[]>([])
  const [pagingParams, setPagingParams] = useState<PagingParams>({ pageNumber: 1, pageSize: 50 })

  useEffect(() => {
    const newColumns: TableColumn[] = dataSource.entitySchema!.fields.map((f) => {
      return { label: f.name }
    })
    setColumns(newColumns)
    dataSource.getRecords().then((r) => {
      setRecords(r)
    })
  }, [dataSource])

  function reloadRecords() {
    dataSource.getRecords().then((r) => {
      setRecords(r)
    })
  }

  function addRecord() {
    onCreateRecord()
    // .then((newRecord: any) => {
    //   reloadRecords()
    //   onSelectedRecordsChange([])
    // })
    // dataSource.entityUpdateMethod(dataSource.entityFactoryMethod()).then((newEntry: any) => {
    //   console.log('new Record', newEntry)
    //   reloadRecords()
    //   onSelectedRecordsChange([])
    // })
  }

  function deleteRecords() {
    if (selectedRecords.length == 0) {
      return
    }
    dataSource.entityDeleteMethod(selectedRecords[0]).then((r) => {
      reloadRecords()
      onSelectedRecordsChange([])
    })
  }

  return (
    <div className='flex flex-col h-full border-4 border-blue-400'>
      <div className={`flex justify-end p-1 ${className} rounded-md mb-2 bg-backgroundtwo dark:bg-backgroundtwodark `}>
        <button
          className='rounded-md p-1 text-green-600 dark:text-green-400 hover:bg-backgroundone dark:hover:bg-backgroundonedark'
          onClick={(e) => addRecord()}
        >
          <PlusCircleIcon></PlusCircleIcon>
        </button>
        <button
          className='rounded-md p-1 text-red-600 dark:text-red-400 hover:bg-backgroundone dark:hover:bg-backgroundonedark'
          onClick={(e) => deleteRecords()}
        >
          <TrashIcon></TrashIcon>
        </button>
      </div>
      <Table
        className='overflow-auto h-full'
        columns={columns}
        records={records}
        onRecordEnter={onRecordEnter}
        onSelectedRecordsChange={(sr) => {
          setSelectedRecords(sr)
          onSelectedRecordsChange(sr)
        }}
        selectedRecord={selectedRecords.length > 1 ? null : selectedRecord}
        pagingParams={pagingParams}
      ></Table>
    </div>
  )
}

export default EntityTable
