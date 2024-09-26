import React, { useEffect, useState } from 'react'
import Table, { TableColumn } from '../components/guifad/_Organisms/Table'
import MultiSelectFilter from '../_Molecules/MultiSelectFilter'
import { getSelectedValues } from '../utils/LogicUtils'
import { SortingField, PagingParams } from 'fusefx-repositorycontract'
import ResizableTable from '../components/guifad/_Organisms/ResizableTable'

const columns: TableColumn[] = [
  { label: 'Id', fieldName: 'id', fieldType: 'number', key: 'id' },
  {
    label: 'Name',
    fieldName: 'name',
    maxCellLength: 400,
    fieldType: 'string',
    key: 'name',
    sortable: true,
  },
  {
    label: 'DateOfBirth',
    fieldName: 'dateOfBirth',
    fieldType: 'date',
    key: 'dateOfBirth',
  },
  {
    label: 'Level',
    fieldName: 'level',
    fieldType: 'number',
    key: 'level',
    onRenderCell: (v) => (
      <button
        className='bg-red-200 p-1 text-xs rounded-md'
        onClick={(e) => console.log('level clicked')}
      >
        TEST
      </button>
    ),
    renderFilter(filter, onFilterChanged, column) {
      return (
        <MultiSelectFilter
          column={column}
          initialValues={getSelectedValues(filter, column.fieldName)}
          onFilterChanged={onFilterChanged}
          options={[
            { label: 'debug', value: 0 },
            { label: 'warning', value: 1 },
            { label: 'error', value: 2 },
          ]}
        ></MultiSelectFilter>
      )
    },
  },
  {
    label: 'Category',
    fieldName: 'category',
    fieldType: 'number',
    key: 'category',
    minCellLength: 3000,
    onRenderCell: (v) => (
      <button
        className='bg-red-200 p-1 text-xs rounded-md'
        onClick={(e) => console.log('level clicked')}
      >
        TEST
      </button>
    ),
    renderFilter(filter, onFilterChanged, column) {
      return (
        <MultiSelectFilter
          column={column}
          initialValues={getSelectedValues(filter, column.fieldName)}
          onFilterChanged={onFilterChanged}
          options={[
            { label: 'good', value: 0 },
            { label: 'bad', value: 1 },
            { label: 'red', value: 2 },
            { label: 'red', value: 2 },
            { label: 'red', value: 2 },
            { label: 'red', value: 2 },
            { label: 'red', value: 2 },
            { label: 'red', value: 2 },
            { label: 'red', value: 2 },
            { label: 'red', value: 2 },
            { label: 'red', value: 2 },
            { label: 'red', value: 2 },
            { label: 'red', value: 2 },
            { label: 'red', value: 2 },
            { label: 'red', value: 2 },
            { label: 'red', value: 2 },
            { label: 'red', value: 2 },
            { label: 'red', value: 2 },
            { label: 'red', value: 2 },
            { label: 'red', value: 2 },
            { label: 'red', value: 2 },
            { label: 'red', value: 2 },
            { label: 'red', value: 2 },
            { label: 'red', value: 2 },
            { label: 'red', value: 2 },
            { label: 'red', value: 2 },
            { label: 'red', value: 2 },
            { label: 'red', value: 2 },
            { label: 'red 1', value: 2 },
          ]}
        ></MultiSelectFilter>
      )
    },
  },
]
const records: any[] = [
  {
    id: 0,
    name: 'horst asdssssssssssss horst asdssssssssssss horst asdssssssssssss horst asdssssssssssss horst asdssssssssssss horst asdssssssssssss horst asdssssssssssss horst asdssssssssssss horst asdssssssssssss horst asdssssssssssss horst asdssssssssssss horst asdssssssssssss',
    dateOfBirth: '16.07.1990',
    level: 13,
  },
  {
    id: 1,
    name: 'einfach horst',
    dateOfBirth: '16.07.1990',
    level: 13,
  },
]

const TableDemo = () => {
  const [currentFilter, setCurrentFilter] = useState<any>({})

  useEffect(() => {
    let initialFilter: any = localStorage.getItem('demo_filter')
    if (!initialFilter) {
      return
    }
    initialFilter = JSON.parse(initialFilter)
    setCurrentFilter(initialFilter)
  }, [])

  function onFilterChange(f: any) {
    setCurrentFilter(f)
    localStorage.setItem('demo_filter', JSON.stringify(f))
  }

  // return (
  //   <ResizableTable
  //     columns={[
  //       { key: 'name', title: 'name' },
  //       { key: 'name2', title: 'name2' },
  //     ]}
  //     data={[{ name: 'asd', name2: 'asdsa asdsa asdsa asdsa asdsa asdsa' }]}
  //   ></ResizableTable>
  // )

  return (
    <div className='overflow-hidden w-full h-full'>
      <Table
        columns={columns}
        records={records}
        selectedRecord={records[0]}
        onSelectedRecordsChange={() => {
          // setCurrentFilter(currentFilter)
        }}
        getId={(r) => {
          console.log('getting id')
          return r.asd
        }}
        totalCount={records.length}
        pagingParams={{ pageNumber: 1, pageSize: 20 }}
        onPagingParamsChange={(p: PagingParams) => {
          console.log('p', p)
        }}
        initialSortingParams={[]}
        onSortingParamsChange={(sp: SortingField[]) => {
          console.log('sorting', sp)
        }}
        onFilterChanged={onFilterChange}
        initialFilters={currentFilter}
        expandableRowProps={{
          rowExpandable: (r: any) => true,
          renderExpandedRow: (r) => <div>{r.name}</div>,
        }}
        rowHeight={0}
      ></Table>
    </div>
  )
}

export default TableDemo
