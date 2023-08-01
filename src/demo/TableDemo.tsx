import React from 'react'
import Table, { TableColumn } from '../components/guifad/_Organisms/Table.tsx'
import { PagingParams } from 'ushell-modulebase/lib/PagingParams.js'
import MultiSelect from '../_Atoms/MultiSelect'
import MultiSelectFilter from '../_Molecules/MultiSelectFilter'
import { getSelectedValues } from '../utils/LogicUtils'

const columns: TableColumn[] = [
  { label: 'Id', fieldName: 'id', fieldType: 'number', key: 'id' },
  { label: 'Name', fieldName: 'name', maxCellLength: 40, fieldType: 'string', key: 'name' },
  { label: 'DateOfBirth', fieldName: 'dateOfBirth', fieldType: 'date', key: 'dateOfBirth' },
  {
    label: 'Level',
    fieldName: 'level',
    fieldType: 'number',
    key: 'level',
    onRenderCell: (v) => (
      <button className='bg-red-200 p-1 text-xs rounded-md' onClick={(e) => console.log('level clicked')}>
        TEST
      </button>
    ),
    renderFilter(filter, onFilterChanged, column) {
      return (
        <MultiSelectFilter
          column={column}
          initialValues={getSelectedValues(filter)}
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
        sortingParams={[]}
        onFilterChanged={(f) => console.log('Filter changed', f)}
        expandableRowProps={{ rowExpandable: (r) => true, renderExpandedRow: (r) => <div>{r.name}</div> }}
      ></Table>
    </div>
  )
}

export default TableDemo
