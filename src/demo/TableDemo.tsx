import React from 'react'
import Table, { TableColumn } from '../components/guifad/_Organisms/Table.tsx'
import { PagingParams } from 'ushell-modulebase/lib/PagingParams.js'

const columns: TableColumn[] = [
  { label: 'Id', fieldName: 'id' },
  { label: 'Name', fieldName: 'name', maxCellLength: 40 },
  { label: 'DateOfBirth', fieldName: 'dateOfBirth' },
  {
    label: 'Level',
    fieldName: 'level',
    onRenderCell: (v) => (
      <button className='bg-red-200 p-1 text-xs rounded-md' onClick={(e) => console.log('level clicked')}>
        TEST
      </button>
    ),
  },
  { label: 'Level 1', fieldName: 'level' },
  { label: 'Level 2', fieldName: 'level' },
  { label: 'Level 3', fieldName: 'level' },
  { label: 'Level 4', fieldName: 'level' },
  { label: 'Level 5', fieldName: 'level' },
  { label: 'Level 6', fieldName: 'level' },
  { label: 'Level 7', fieldName: 'level' },
  { label: 'Level 8', fieldName: 'level' },
]
const records: any[] = [
  {
    id: 0,
    name: 'horst asdssssssssssss horst asdssssssssssss horst asdssssssssssss horst asdssssssssssss',
    dateOfBirth: '16.07.1990',
    level: 13,
  },
]

const TableDemo = () => {
  return (
    <div className='overflow-hidden w-full h-full'>
      <Table
        columns={columns}
        records={records}
        totalCount={records.length}
        pagingParams={{ pageNumber: 1, pageSize: 20 }}
        onPagingParamsChange={(p: PagingParams) => {
          console.log('p', p)
        }}
      ></Table>
    </div>
  )
}

export default TableDemo
