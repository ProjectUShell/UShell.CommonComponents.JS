import React from 'react'
import Table, { TableColumn } from '../components/guifad/_Organisms/Table'

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
    label: 'Date of Birth',
    fieldName: 'birthday',
    maxCellLength: 400,
    fieldType: 'date',
    key: 'birthday',
    sortable: true,
  },
]

const records: any[] = [
  {
    id: 1,
    name: 'Peter',
    birthday: '2000-01-01',
  },
  {
    id: 1,
    name: 'Ann',
    birthday: '2002-03-11',
  },
  {
    id: 1,
    name: 'Nico',
    birthday: '1987-12-04',
  },
]
const TableDemoBasic = () => {
  return (
    <div className='w-full'>
      <Table
        columns={columns}
        records={records}
        tableColors={{ header: 'bg-bg7 dark:bg-bg6dark hover:bg-bg9 dark:hover:bg-bg8dark' }}
      ></Table>
    </div>
  )
}

export default TableDemoBasic
