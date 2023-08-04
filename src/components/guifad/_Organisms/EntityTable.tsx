import React, { useEffect, useState } from 'react'
import { IDataSource } from 'ushell-modulebase'
import Table, { TableColumn } from './Table.tsx'
import PlusCircleIcon from '../../../_Icons/PlusCircleIcon'
import TrashIcon from '../../../_Icons/TrashIcon'
import { useQuery } from '@tanstack/react-query'
import { FuseConnector } from '../FuseConnector.js'
import { PagingParams } from 'ushell-modulebase/lib/PagingParams.js'
import { SortingField } from 'ushell-modulebase/lib/SortingField.js'

const EntityTable: React.FC<{
  dataSource: IDataSource
  className?: string
  onRecordEnter: (r: any) => void
  onSelectedRecordsChange: (selectedRecords: any[]) => void
  selectedRecord: any | null
  onCreateRecord: () => void
}> = ({ dataSource, className, onRecordEnter, onSelectedRecordsChange, selectedRecord, onCreateRecord }) => {
  // const [records, setRecords] = useState<any[]>([])
  const [selectedRecords, setSelectedRecords] = useState<any[]>([])
  const [columns, setColumns] = useState<TableColumn[]>([])
  const [pagingParams, setPagingParams] = useState<PagingParams>({ pageNumber: 1, pageSize: 10 })
  const [sortingParams, setSortingParams] = useState<SortingField[]>([])
  const [reloadTrigger, setReloadTrigger] = useState(0)

  function forceReload() {
    setReloadTrigger((r) => r + 1)
  }

  useEffect(() => {
    const newColumns: TableColumn[] = dataSource.entitySchema!.fields.map((f) => {
      return { label: f.name, fieldName: f.name, fieldType: f.type, key: f.name }
    })
    setColumns(newColumns)
    // dataSource.getRecords().then((r) => {
    //   setRecords(r)
    // })
  }, [dataSource])

  const { isLoading, error, data } = useQuery({
    queryKey: [dataSource.entitySchema!.name, pagingParams, sortingParams, reloadTrigger],
    queryFn: () => dataSource.getRecords(undefined, pagingParams, sortingParams),
  })

  const data1: any = data

  if (isLoading) return <div>Loading...</div>

  if (error) return <div>An error has occurred: {error.toString()}</div> //+ error.message

  // function reloadRecords() {
  //   dataSource.getRecords().then((r) => {
  //     setRecords(r)
  //   })
  // }

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
      // reloadRecords()
      setSelectedRecords([])
      onSelectedRecordsChange([])
      forceReload()
    })
  }

  return (
    <div className='flex flex-col h-full'>
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
        records={data1!.page}
        onRecordEnter={onRecordEnter}
        onSelectedRecordsChange={(sr) => {
          setSelectedRecords(sr)
          onSelectedRecordsChange(sr)
        }}
        selectedRecord={selectedRecords.length > 1 ? null : selectedRecord}
        pagingParams={pagingParams}
        totalCount={data1!.total}
        onPagingParamsChange={(pp) => setPagingParams(pp)}
        initialSortingParams={sortingParams}
        onSortingParamsChange={(sp) => {
          console.log('sp', sp)
          setSortingParams(sp)
        }}
      ></Table>
    </div>
  )
}

export default EntityTable
