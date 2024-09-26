import { LogicalExpression } from 'fusefx-repositorycontract'
import React, { useState } from 'react'
import { buildEqualsFilter, getFirstEqualsFilterValue } from '../utils/LogicUtils'
import { TableColumn } from '../components/guifad/_Organisms/Table'

const StringFilter: React.FC<{
  fieldName: string
  filter: LogicalExpression
  onFilterChange: (newFilter: LogicalExpression | null) => void
}> = ({ fieldName, filter, onFilterChange }) => {
  const [v, setV] = useState(getFirstEqualsFilterValue(filter, fieldName))

  function submit() {
    const newFilter: LogicalExpression = buildEqualsFilter(fieldName, v)
    onFilterChange(newFilter)
  }

  function clear() {
    onFilterChange(null)
  }

  return (
    <div className='flex flex-col gap-2 items-center w-full p-2 min-w-64'>
      <input
        placeholder='enter filter value'
        className='border text-base font-normal p- w-full'
        value={v}
        onChange={(e) => setV(e.target.value)}
      ></input>
      <div className='flex gap-1 justify-end p-1'>
        <label className='inline-flex items-center cursor-pointer'>
          <input type='checkbox' value='' className='sr-only peer' />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className='ms-3 text-sm font-medium text-gray-900 dark:text-gray-300'>
            Exact match
          </span>
        </label>
      </div>
      <div className='flex gap-1 justify-end p-1 text-base'>
        <button className='bg-bg4 dark:bg-bg4dark p-1 rounded-sm' onClick={() => clear()}>
          Clear
        </button>
        <button className='bg-bg4 dark:bg-bg4dark p-1 rounded-sm' onClick={() => submit()}>
          Ok
        </button>
      </div>
    </div>
  )
}

export function renderTextFilter(
  filter: LogicalExpression,
  onFilterChange: (newFilter: LogicalExpression | null) => void,
  column: TableColumn,
) {
  return (
    <StringFilter
      fieldName={column.fieldName}
      filter={filter}
      onFilterChange={onFilterChange}
    ></StringFilter>
  )
}

export default StringFilter
