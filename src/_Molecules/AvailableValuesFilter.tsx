import { LogicalExpression } from 'fusefx-repositorycontract'
import React, { useMemo, useState } from 'react'
import { TableColumn } from '../components/guifad/_Organisms/Table'
import AvailableDateValuesFilter from './AvailableDateValuesFilter'
import AvailableNumberValuesFilter from './AvailableNumberValuesFilter'
import AvailableStringValuesFilter from './AvailableStringValuesFilter'
import {
  applyFilter,
  buildEqualsFilter,
  buildIsInFilter,
  getSelectedValues,
} from '../utils/LogicUtils'
import MagnifyingGlassIcon from '../_Icons/MagnifyingGlassIcon'
import DropdownSelectBasic from '../demo/DropdownSelectBasic'

const AvailableValuesFilter: React.FC<{
  column: TableColumn
  filter: LogicalExpression
  onFilterChange: (newFilter: LogicalExpression | null) => void
  availableValues: any[]
}> = ({ column, filter, onFilterChange, availableValues }) => {
  const [selectAll, setSelectAll] = useState(false)
  const initialValues: any[] = useMemo(() => {
    return getSelectedValues(filter, column.fieldName)
  }, [filter])
  const [currentValues, setCurrentValues] = useState<any[]>(initialValues)
  const [currentSearchFilter, setCurrentSearchFilter] = useState('')

  function submit() {
    const newFilter: LogicalExpression | null =
      currentValues.length > 0 ? buildIsInFilter(column.fieldName, currentValues) : null
    onFilterChange(newFilter)
  }
  function clear() {
    onFilterChange(null)
  }

  function onSelectAll(checked: boolean) {
    if (selectAll) {
      setCurrentValues([])
    } else {
      setCurrentValues(availableValues)
    }
    setSelectAll(checked)
  }

  function renderMultiSelect() {
    switch (column.fieldType.toLocaleLowerCase()) {
      case 'date':
        return <AvailableDateValuesFilter availableValues={[]}></AvailableDateValuesFilter>
      case 'int32':
        return <AvailableNumberValuesFilter availableValues={[]}></AvailableNumberValuesFilter>
      default:
        return (
          <AvailableStringValuesFilter
            availableValues={availableValues.filter((av) => av.includes(currentSearchFilter))}
            initialValues={currentValues}
            onSelectionChange={(selectedValues: string[]) => setCurrentValues(selectedValues)}
          ></AvailableStringValuesFilter>
        )
    }
  }

  return (
    <div className='flex flex-col w-full h-full overflow-hidden border-red-400 border-0'>
      <div className='border-0 mb-1 m-2'>
        <label
          className='flex items-center space-x-2 p-2
            border-b-2 border-bg7 dark:border-bg7dark focus-within:border-prim4 focus-within:dark:border-prim6
            rounded-sm  w-full transition-all bg-bg4 dark:bg-bg4dark  '
        >
          <MagnifyingGlassIcon></MagnifyingGlassIcon>
          <input
            type='text'
            className='bg-bg4 dark:bg-bg4dark outline-none font-thin text-base'
            value={currentSearchFilter}
            onChange={(e) => setCurrentSearchFilter(e.target.value)}
          />
        </label>
      </div>
      <div className='border-b mb-1 m-2'>
        <label className='flex items-center space-x-2 p-2'>
          <input
            type='checkbox'
            onChange={(e) => onSelectAll(e.target.checked)}
            className='form-checkbox h-4 w-4 accent-blue-400'
          />
          <span className='text-sm font-normal px-4'>Select All</span>
        </label>
      </div>
      <div className='border-b p-2 border-0 border-blue-400 h-full overflow-auto'>
        {renderMultiSelect()}
      </div>
      <div className='m-2 flex justify-end'>
        <button
          className='p-1 px-6 rounded-sm hover:bg-bg4 dark:hover:bg-bg4dark'
          onClick={(e) => {
            e.stopPropagation()
            submit()
            clear()
          }}
        >
          Clear
        </button>
        <button
          className='p-2 px-6 rounded-sm hover:bg-bg4 dark:hover:bg-bg4dark'
          onClick={(e) => {
            e.stopPropagation()
            submit()
          }}
        >
          Ok
        </button>
      </div>
    </div>
  )
}

export function renderAvailableValuesFilter(
  filter: LogicalExpression,
  onFilterChange: (newFilter: LogicalExpression | null) => void,
  column: TableColumn,
  availableRecords: any[],
) {
  return (
    <AvailableValuesFilter
      column={column}
      filter={filter}
      onFilterChange={onFilterChange}
      availableValues={availableRecords.map((ar) => ar[column.fieldName])}
    ></AvailableValuesFilter>
  )
}

export function renderCustomAvailableValuesFilter(
  availableValues: any[],
  filter: LogicalExpression,
  onFilterChange: (newFilter: LogicalExpression | null) => void,
  column: TableColumn,
) {
  return (
    <AvailableValuesFilter
      column={column}
      filter={filter}
      onFilterChange={onFilterChange}
      availableValues={availableValues}
    ></AvailableValuesFilter>
  )
}

export default AvailableValuesFilter
