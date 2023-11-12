import React, { useEffect, useState } from 'react'
import { IDataSource } from 'ushell-modulebase'
import Table, { TableColumn } from './Table.tsx'
import PlusCircleIcon from '../../../_Icons/PlusCircleIcon'
import TrashIcon from '../../../_Icons/TrashIcon'
import { useQuery } from '@tanstack/react-query'
import { EntitySchema, SchemaRoot } from 'fusefx-modeldescription'
import { LogicalExpression, PagingParams, SortingField } from 'fusefx-repositorycontract'
import { getParentFilter } from '../../../data/DataSourceService'
import FunnelIcon from '../../../_Icons/FunnelIcon'
import Modal from '../../../_Atoms/Modal'
import Dropdown from '../../../_Atoms/Dropdown'
import DropdownButton from '../../../_Atoms/DropdownButton'
import LogicalExpressionEditor from '../_Molecules/LogicalExpressionEditor'
import FilterTagBar from '../_Molecules/FilterTagBar'

const EntityTable: React.FC<{
  dataSource: IDataSource
  parentSchema: EntitySchema | undefined
  parent: any | undefined
  schemaRoot: SchemaRoot
  className?: string
  onRecordEnter: (r: any) => void
  onSelectedRecordsChange: (selectedRecords: any[]) => void
  selectedRecord: any | null
  onCreateRecord: () => void
}> = ({
  dataSource,
  schemaRoot,
  parentSchema,
  parent,
  className,
  onRecordEnter,
  onSelectedRecordsChange,
  selectedRecord,
  onCreateRecord,
}) => {
  // const [records, setRecords] = useState<any[]>([])
  const [selectedRecords, setSelectedRecords] = useState<any[]>([])
  const [columns, setColumns] = useState<TableColumn[]>([])
  const [pagingParams, setPagingParams] = useState<PagingParams>({ pageNumber: 1, pageSize: 10 })
  const [sortingParams, setSortingParams] = useState<SortingField[]>([])
  const [filter, setFilter] = useState<LogicalExpression[]>([])
  const [reloadTrigger, setReloadTrigger] = useState(0)

  function forceReload() {
    setReloadTrigger((r) => r + 1)
  }

  useEffect(() => {
    setSelectedRecords([])
  }, [selectedRecord])

  useEffect(() => {
    const newColumns: TableColumn[] = dataSource.entitySchema!.fields.map((f) => {
      return { label: f.name, fieldName: f.name, fieldType: f.type, key: f.name }
    })
    setColumns(newColumns)
    // dataSource.getRecords().then((r) => {
    //   setRecords(r)
    // })
  }, [dataSource])

  function buildFilterExpression(): LogicalExpression | undefined {
    const parentFilter: LogicalExpression | null =
      parentSchema && parent && schemaRoot
        ? getParentFilter(schemaRoot, parentSchema, dataSource.entitySchema!, parent)
        : null
    const result: LogicalExpression = new LogicalExpression()
    filter.forEach((f) => result.expressionArguments.push(f))
    if (parentFilter) {
      result.expressionArguments.push(parentFilter)
    }
    switch (result.expressionArguments.length) {
      case 0:
        return undefined
      case 1:
        result.operator = 'and'
        break
      default:
        result.operator = 'and'
        break
    }
    console.log('filter result', result)
    return result
  }

  const { isLoading, error, data } = useQuery({
    queryKey: [
      dataSource.entitySchema!.name,
      pagingParams,
      sortingParams,
      reloadTrigger,
      filter,
      parent,
      parentSchema,
      schemaRoot,
    ],
    queryFn: () => {
      return dataSource.getRecords(buildFilterExpression(), pagingParams, sortingParams)
    },
  })

  const data1: any = data

  if (isLoading) return <div>Loading...</div>

  if (error) return <div>An error has occurred: {error.toString()}</div> //+ error.message

  function addRecord() {
    onCreateRecord()
  }

  function deleteRecords() {
    if (selectedRecords.length == 0) {
      return
    }
    dataSource.entityDeleteMethod(selectedRecords[0]).then((r) => {
      setSelectedRecords([])
      onSelectedRecordsChange([])
      forceReload()
    })
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='flex justify-between'>
        <div className={`flex p-1 ${className} rounded-md bg-backgroundtwo dark:bg-backgroundtwodark `}>
          <DropdownButton leftOffset={1} topOffset={-1} buttonContent={<FunnelIcon size={5}></FunnelIcon>}>
            <LogicalExpressionEditor
              intialExpression={null}
              fields={dataSource.entitySchema!.fields}
              onUpdateExpression={(e) => {
                setFilter((f) => [...f, e])
                console.log('filter', e)
              }}
            ></LogicalExpressionEditor>
          </DropdownButton>
        </div>
        <div className={`flex justify-end p-1 ${className} rounded-md bg-backgroundtwo dark:bg-backgroundtwodark `}>
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
      </div>
      <div>
        <FilterTagBar
          className='mb-1 rounded-md'
          filters={filter}
          fields={dataSource.entitySchema!.fields}
          onUpdateFilters={(uf) => setFilter(uf)}
        ></FilterTagBar>
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
          setSortingParams(sp)
        }}
        rowHeight={2}
      ></Table>
    </div>
  )
}

export default EntityTable
