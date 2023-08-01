import React, { useState } from 'react'
import MultiSelect, { Option } from '../_Atoms/MultiSelect'
import { LogicalExpression } from 'ushell-modulebase/lib/LogicalExpression'
import { RelationElement } from 'ushell-modulebase/lib/RelationElement'
import { TableColumn } from '../components/guifad/_Organisms/Table.tsx'

const MultiSelectFilter: React.FC<{
  column: TableColumn
  options: Option[]
  onFilterChanged: (filter: LogicalExpression | null) => void
  initialValues: any[]
}> = ({ options, onFilterChanged, initialValues, column }) => {
  const [selectedValues, setSelectedValues] = useState<any[]>([])

  function onSelectionChanged(sv: any[] | null) {
    if (!sv) {
      onFilterChanged(null)
      return
    }
    const relation: RelationElement = {
      propertyName: column.fieldName,
      relation: 'in',
      propertyType: column.fieldType,
      value: sv,
    }
    const columnFilter: LogicalExpression = {
      expressionArguments: [],
      operator: 'atom',
      atomArguments: [relation],
    }
    onFilterChanged(columnFilter)
  }

  return (
    <div className='flex flex-col'>
      <MultiSelect
        initialValues={initialValues}
        options={options}
        onSelectionChange={(sv: any[]) => setSelectedValues(sv)}
      ></MultiSelect>
      <div className='flex justify-end gap-1 text-sm'>
        <button className='rounded-md hover:bg-backgroundtwo p-1' onClick={(e) => onSelectionChanged(null)}>
          Clear
        </button>
        <button className='rounded-md hover:bg-backgroundtwo p-1' onClick={(e) => onSelectionChanged(selectedValues)}>
          Ok
        </button>
      </div>
    </div>
  )
}

export default MultiSelectFilter
